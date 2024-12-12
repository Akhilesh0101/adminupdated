import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../admin-services/product.service';
import { Product } from '../admin-services/product.service';

@Component({
  selector: 'app-admin-product-form',
  templateUrl: './admin-product-form.component.html',
  imports:[ReactiveFormsModule],
  styleUrls: ['./admin-product-form.component.css']
})
export class AdminProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  selectedProduct: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize the product form with controls
    this.productForm = this.fb.group({
      ProductName: ['', Validators.required],
      Price: [null, [Validators.required, Validators.min(0)]],
      Description: ['', Validators.required],
      StockQuantity: [null, [Validators.required, Validators.min(0)]],
      CategoryId: [null, [Validators.required]],
      Productimg: [null, Validators.required], // Image is required to be selected
    });

    // Check if we are in edit mode (product exists)
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.productId = +params['id'];
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  // Load product details for editing
  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product) => {
        this.selectedProduct = product;
        this.productForm.patchValue({
          ProductName: product.ProductName,
          Price: product.Price,
          Description: product.Description,
          StockQuantity: product.StockQuantity,
          CategoryId: product.CategoryId,
        });
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  // Handle form submission (add or update product)
  onSubmit(): void {
    // Check if the form is invalid or if any required field is missing
    if (this.productForm.invalid) {
      console.error('Form is invalid');
      return; // Do not proceed with submission if form is invalid
    }
  
    // Extract form values
    const { ProductName, Price, Description, StockQuantity, CategoryId, Productimg } = this.productForm.value;
  
    // Check if any required fields are undefined or null
    if (!ProductName || !Price || !Description || !StockQuantity || !CategoryId || !Productimg) {
      console.error('One or more required fields are missing.');
      return; // Ensure all required fields have values before submission
    }
  
    // Create FormData
    const formData = new FormData();
    formData.append('ProductName', ProductName);
    formData.append('Price', Price.toString()); // Ensure Price is a string
    formData.append('Description', Description);
    formData.append('StockQuantity', StockQuantity.toString()); // Ensure StockQuantity is a string
    formData.append('CategoryId', CategoryId.toString()); // Ensure CategoryId is a string
    formData.append('Productimg', Productimg); // Assuming Productimg is the file object
  
    // Add CreatedByAdminId programmatically
    const CreatedByAdminId = 1;  // You may retrieve this dynamically based on the logged-in user
    formData.append('CreatedByAdminId', CreatedByAdminId.toString());
  
    // Log each form data entry
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    // Log the entire FormData object for inspection
    console.log("Form Data to Submit:", formData);
  
    // Determine if we are editing or adding a product
    if (this.isEditMode && this.productId !== null) {
      this.productService.updateProductWithFormData(this.productId, formData).subscribe(
        (updatedProduct) => {
          this.router.navigate(['/admin-product']);
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
    } else {
      this.productService.addProductWithFormData(formData).subscribe(
        () => {
          this.router.navigate(['/admin-product']);
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );
    }
  }
  
  

  // Handle image file selection
  onFileSelect(event: any): void {
    const file = event.target.files[0];  // Get the selected file
    if (file) {
      this.productForm.patchValue({
        Productimg: file  // Patch the file into the form control
      });
    } else {
      console.error('No file selected');
    }
  }
}
