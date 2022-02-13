import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { UploadFilesModel } from 'app/modules/utility/models/upload-files.model';
import { UploadService } from 'app/modules/utility/services/upload.service';

@Component({
    selector: 'image-uploader',
    templateUrl: 'image-uploader.component.html',
    styleUrls: ['image-uploader.component.less']
})
export class ImageUploaderComponent {
    @Input() uploadToServer: boolean = false;
    @Input() uploadCategory: string = '';
    @Input() prefixUrl: string = null;
    @Input() defaultPicture: string = null;
    @Input() picture: string = null;
    @Input() size = 'lg';

    @Output() change = new EventEmitter<string>();

    @ViewChild('fileUpload') public _fileUpload: ElementRef;

    constructor(private uploadService: UploadService) {}

    public async changePicture() {
        const files = this._fileUpload.nativeElement.files;

        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.addEventListener(
                'load',
                async (event: Event) => {
                    this.picture = (<any>event.target).result;
                    if (this.uploadToServer) {
                        const response = (await this.uploadService.upload(
                            new UploadFilesModel({
                                files: [this.picture],
                                path: this.uploadCategory
                            })
                        )) as string[];
                        this.change.emit(response[0]);
                    } else {
                        this.change.emit(this.picture);
                    }
                },
                false
            );
            reader.readAsDataURL(file);
        }
    }

    public async removePicture() {
        this.picture = null;
        this.change.emit(this.picture);
    }
}
