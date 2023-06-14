import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, OutputFormat } from 'ngx-image-cropper';

@Component({
  selector: 'app-img-cropper',
  templateUrl: './img-cropper.component.html',
  styleUrls: ['./img-cropper.component.scss'],
})
export class ImgCropperComponent {
  @Input('event') event!: any;
  @Input('type') type!: any;
  imageChangedEvent!: unknown;
  croppedImage!: string | null | undefined | unknown;
  aspectRatio: number = 1280 / 720;
  minWidth = 900;
  output!: OutputFormat;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    this.imageChangedEvent = this.event;
    this.updateOutputFormat(this.type);
  }

  imageCropped(event: ImageCroppedEvent): void {
    const reader = new FileReader();
    reader.readAsDataURL(event.blob!);
    reader.onload = () => {
      this.croppedImage = reader.result;
    };
    reader.onerror = () => {
      console.error(reader.error);
    };
  }

  updateOutputFormat(fileType: string): void {
    if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
      this.output = 'jpeg';
    } else if (fileType === 'image/png') {
      this.output = 'png';
    } else if (fileType === 'image/webp') {
      this.output = 'webp';
    } else {
      this.output = 'png';
    }
  }

  loadImageFailed(event: any) {
    console.error('cropper error: ' + event.message);
  }

  close(result: any) {
    if (!result) this.modal.close(false);
    else this.modal.close(this.croppedImage);
  }
}
