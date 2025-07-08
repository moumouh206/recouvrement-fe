import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the state of the upload process
type UploadStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.html',
})
export class FileUploaderComponent {
  // Input to customize the accepted file types
  @Input() acceptedTypes =
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

  // Output to notify the parent component when the upload is "complete"
  @Output() uploadComplete = new EventEmitter<void>();

  selectedFile: File | null = null;
  status: UploadStatus = 'idle';
  isDragOver = false;

  // --- Event Handlers for File Selection ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  // --- Drag and Drop Handlers ---
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.selectedFile = file;
    this.status = 'selected';
  }

  // --- Action Handlers ---
  triggerUpload(): void {
    if (!this.selectedFile) return;

    this.status = 'uploading';

    // In a real app, this is where you would use HttpClient to post the file
    // to your backend API.
    // const formData = new FormData();
    // formData.append('file', this.selectedFile, this.selectedFile.name);
    // this.http.post('/api/bordereaux/upload', formData).subscribe(...)

    // We simulate the upload process with a timeout.
    // We'll randomly succeed or fail to show both states.
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      if (success) {
        this.status = 'success';
        this.uploadComplete.emit(); // Notify parent
      } else {
        this.status = 'error';
      }
    }, 2000);
  }

  reset(): void {
    this.selectedFile = null;
    this.status = 'idle';
  }

  // --- Helper Functions for Template ---
  getFileName(): string {
    return this.selectedFile ? this.selectedFile.name : '';
  }

  getFileSize(): string {
    if (!this.selectedFile) return '';
    const sizeInKB = this.selectedFile.size / 1024;
    return `${sizeInKB.toFixed(1)} KB`;
  }
}
