import { Component, Input } from '@angular/core';
import { FileType } from './../../../../constants/file-type.enum';
import { MessageStatus } from '../../const/message-status.enum';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.less']
})

export class MessageComponent {
    @Input() avatar = '';
    @Input() position = '';
    @Input() content = '';
    @Input() time: number;
    @Input() showDate = false;
    @Input() status = '';
    @Input() image = '';
    @Input() name = '';
    icon = {
        [MessageStatus.SEND]: 'done',
        [MessageStatus.SEEN]: 'done_all',
        [MessageStatus.WAITING]: 'access_time',
        [MessageStatus.ERROR]: 'error_outline'
    };
    defaultImage = 'assets/images/lazy-loading.svg';
    previewVisible = false;
    imageExtension: string[] = [
        FileType.IMAGE_BMP,
        FileType.IMAGE_GIF,
        FileType.IMAGE_JPEG,
        FileType.IMAGE_JPG,
        FileType.IMAGE_PNG
    ];
    videoExtension: string[] = [FileType.VIDEO_MP4];
    scrollTarget = document.getElementById('messages-scroll-container');

    onCancel() {
        this.previewVisible = false;
    }

    setVisible() {
        this.previewVisible = true;
    }

    isImageOrVideo() {
        if (this.image && this.imageExtension.includes(this.image.split('.').pop())) {
            return 'image';
        }
        if (this.image && this.videoExtension.includes(this.image.split('.').pop())) {
            return 'video';
        }
    }
}