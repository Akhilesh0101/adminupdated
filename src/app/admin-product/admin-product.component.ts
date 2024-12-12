import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../admin-services/product.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  imports:[ReactiveFormsModule,FormsModule,CommonModule],
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        console.log(data)
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  onAddProduct(): void {
    this.router.navigate(['/admin-product-form']);
  }

  onEditProduct(product: Product): void {
    this.router.navigate(['/admin-product-form'], {
      queryParams: { id: product.ProductId },
    });
  }

  onDeleteProduct(productId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.products = this.products.filter((p) => p.ProductId !== productId);
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }
}
