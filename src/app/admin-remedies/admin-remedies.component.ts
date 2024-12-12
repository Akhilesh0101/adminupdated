import { Component, OnInit } from '@angular/core';
import { Remedy, RemedyService } from '../admin-services/remedy.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-remedies',
  templateUrl: './admin-remedies.component.html',
  imports:[ReactiveFormsModule,FormsModule,CommonModule],
  styleUrls: ['./admin-remedies.component.css']
})
export class AdminRemediesComponent implements OnInit {
  remedies: Remedy[] = [];
  isAddMode: boolean = false;  // Flag to check if the form is in add or edit mode
  selectedRemedy: Remedy | null = null;  // To hold the remedy being edited
  imagePreview: string | null = null;  // To display the image preview

  constructor(private remedyService: RemedyService) { }

  ngOnInit(): void {
    this.loadRemedies();
  }

  // Load all remedies from the API
  loadRemedies() {
    this.remedyService.getRemedies().subscribe(
      (data: Remedy[]) => {
        this.remedies = data;
      },
      (error) => {
        console.error('Error fetching remedies:', error);
      }
    );
  }

  // Handle Add Remedy
  onAddRemedy() {
    this.isAddMode = true;
    this.selectedRemedy = {
      RemedyId: 0,
      RemedyName: '',
      Remediesimg: '',
      Description: '',
      Benefits: '',
      PreparationMethod: '',
      UsageInstructions: '',
      CategoryId: 1,
      CreatedByAdminId: 1
    };
    this.imagePreview = null;  // Reset image preview on Add
  }

  // Handle Edit Remedy
  onEditRemedy(remedy: Remedy) {
    this.isAddMode = false;
    this.selectedRemedy = { ...remedy };
    this.imagePreview = remedy.Remediesimg ? 'data:image/jpeg;base64,' + remedy.Remediesimg : null; // Show image preview if available
  }

  // Handle File Input for Image Upload
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Set the image preview
        if (this.selectedRemedy) {
          this.selectedRemedy.Remediesimg = this.imagePreview.split(',')[1]; // Convert image to base64 string
        }
      };
      reader.readAsDataURL(file);  // Convert the image to base64 format
    }
  }

  // Handle Form Submit for Add/Edit
  onSubmit() {
    if (this.selectedRemedy) {
      if (this.isAddMode) {
        this.remedyService.addRemedy(this.selectedRemedy).subscribe(
          (newRemedy) => {
            this.remedies.push(newRemedy);
            this.selectedRemedy = null;
            this.imagePreview = null;  // Clear image preview
          },
          (error) => {
            console.error('Error adding remedy:', error);
          }
        );
      } else {
        this.remedyService.updateRemedy(this.selectedRemedy.RemedyId, this.selectedRemedy).subscribe(
          () => {
            const index = this.remedies.findIndex(r => r.RemedyId === this.selectedRemedy?.RemedyId);
            if (index !== -1) {
              this.remedies[index] = this.selectedRemedy!;
            }
            this.selectedRemedy = null;
            this.imagePreview = null;  // Clear image preview
          },
          (error) => {
            console.error('Error updating remedy:', error);
          }
        );
      }
    }
  }

  // Handle Delete Remedy
  onDeleteRemedy(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this remedy?');
    if (confirmDelete) {
      this.remedyService.deleteRemedy(id).subscribe(
        () => {
          this.remedies = this.remedies.filter(r => r.RemedyId !== id);
        },
        (error) => {
          console.error('Error deleting remedy:', error);
        }
      );
    }
  }
}
