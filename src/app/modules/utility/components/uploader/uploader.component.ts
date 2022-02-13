import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';
import { FileType } from './../../../../constants/file-type.enum';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UploadService } from 'app/modules/utility/services/upload.service';

@Component({
    selector: 'nz-file-uploader',
    templateUrl: './uploader.component.html',
    styles: ['./uploader.component.less']
})
export class UploaderComponent {
    @Output() nzChange = new EventEmitter<string[]>();
    upData = {};
    upListType = 'picture-card';
    upFileList = [];
    upShowButton = true;
    previewImage = '';
    previewVisible = false;
    showUploadList = true;
    upFileType = '';
    acceptType = '';
    previewVideo = '';
    thumbnailVideo = 'assets/images/video-thumbnail.png';
    images: string[] = [
        FileType.IMAGE_JPEG,
        FileType.IMAGE_BMP,
        FileType.IMAGE_JPG,
        FileType.IMAGE_PNG,
        FileType.IMAGE_GIF
    ];
    videos: string[] = [FileType.VIDEO_MP4];

    beforeUpload = () => {
        return true;
    }

    constructor(private uploadService: UploadService) { }

    onFileListChange(data: { file: NzUploadFile; fileList: NzUploadFile[] }) {
        const { file, fileList } = data;
        if (
            file.status &&
            (file.status === 'done' || file.status === 'removed')
        ) {
            const filePathData = [];
            if (fileList.length) {
                fileList.forEach(item => {
                    if (this.isVideo(item)) {
                        item.url =
                            item.response &&
                                item.response.data &&
                                item.response.data.length
                                ? item.response.data[0].fullPath
                                : item.thumbUrl;
                        item.thumbUrl = this.thumbnailVideo;
                    }
                    if (item.url) {
                        filePathData.push(item.url);
                    } else if (
                        item.response &&
                        item.response.data &&
                        item.response.data.length
                    ) {
                        item.response.data.forEach(fileData => {
                            filePathData.push(fileData.fullPath);
                        });
                    }
                });
            }
            this.nzChange.emit(filePathData);
        }
    }

    customUpload = (file: any) => {
        return this.uploadService.uploadFile(file);
    }

    @Input()
    set nzData(value: object) {
        this.upData = value;
    }

    @Input()
    set nzShowButton(value: boolean) {
        this.upShowButton = value;
    }

    @Input()
    set nzShowUploadList(value) {
        if (value) {
            this.showUploadList = value;
        }
    }

    @Input()
    set nzListType(value: string) {
        this.upListType = value;
    }

    @Input()
    set nzFileList(value: [object]) {
        this.upFileList = value;
        this.upFileList.forEach(file => {
            if (this.isVideo(file)) {
                file.thumbUrl = this.thumbnailVideo;
            }
        });
    }

    @Input()
    set nzFileType(value: string) {
        this.upFileType = value;
    }

    @Input()
    set nzAccept(value: string) {
        this.acceptType = value;
    }

    @Input()
    set nzBeforeUpload(value) {
        this.beforeUpload = value;
    }

    handlePreview = (file: NzUploadFile) => {
        this.previewImage = '';
        this.previewVideo = '';

        if (this.isImage(file)) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        }

        if (this.isVideo(file)) {
            this.previewVideo = file.url;
            this.previewVisible = true;
        }
    }

    isImage(file: NzUploadFile) {
        return (
            (file.url && this.images.includes(file.url.split('.').pop())) ||
            (file.type && file.type.includes('image'))
        );
    }

    isVideo(file: NzUploadFile) {
        return (
            (file.url && this.videos.includes(file.url.split('.').pop())) ||
            (file.type && file.type.includes('video'))
        );
    }

    onCancel() {
        this.previewImage = '';
        this.previewVideo = '';
        this.previewVisible = false;
    }
}
