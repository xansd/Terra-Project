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
  imageChangedEvent!: unknown;
  croppedImage!: string | null | undefined;
  aspectRatio: number = 346 / 167;
  minWidth = 700;
  // imageQuality = 50;
  output!: OutputFormat;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    this.imageChangedEvent = this.event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(event: any) {
    // console.log('image loaded');
  }
  cropperReady(event: any) {
    // console.log('cropper ready');
  }

  loadImageFailed(event: any) {
    console.log('error');
  }

  close(result: any) {
    if (!result) this.modal.close(false);
    else this.modal.close(this.croppedImage);
  }
}
