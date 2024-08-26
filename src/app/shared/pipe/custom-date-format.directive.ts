import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'customDateFormat',
})
export class customDateFormatPipe implements PipeTransform {
    transform(value: string) {
       var datePipe = new DatePipe("en-US");
        value = datePipe.transform(value, 'MM/dd/yyyy');
        return value;
    }
}
