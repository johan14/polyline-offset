import { Injectable } from '@angular/core';
import { LatLngCustom } from './LatLng';

@Injectable({
  providedIn: 'root'
})
export class OffsetService {

  constructor() { }

  generateOffset(array: any[], offset) {

      
    //array = this.latLngToPoint(array)

    let sameSlope = [];
    let offsetedArray = [];
    let prevSlope = this.newSlope(array[1], array[0]);

    for (let i = 0; i < array.length - 1; i++) {
      if (prevSlope == this.newSlope(array[i + 1], array[i]) && i != array.length - 2) {
        sameSlope.push(array[i]);
      }
      else {
        console.log(array[i])
        sameSlope.push(array[i]);
      
        if (sameSlope.length > 1) {
          this.calculateOffsetArray(sameSlope, offset);
          console.log('sameslope',sameSlope)
          offsetedArray.push(... this.calculateOffsetArray(sameSlope,offset))
        }
        sameSlope = [];
        sameSlope.push(array[i])
        prevSlope = this.newSlope(array[i + 1], array[i]);
      }
    }
    console.log('offsetedArray', offsetedArray);
    
    return offsetedArray;
  }

  private newSlope(p2: any[], p1: any[]) {
    return (p2[1] - p1[1]) / (p2[0] - p1[0])
  }

  private calculateOffsetArray(array: any[], offset) {
    let extremePoints: any[] = [array[0], array[array.length - 1]];
    let slope = this.newSlope(extremePoints[1], extremePoints[0]);
    let direction = this.findDirection(extremePoints);
    let offsetArray: any[] = [];

    for (let i = 0; i < extremePoints.length; i++) {
      offsetArray.push(this.getOffsetedPoint(extremePoints[i], offset, slope, direction))
    }

    return offsetArray;
  }

  private getOffsetedPoint(point: any[], offset, slope, direction) {

    let x, y;
    switch (direction) {
      case 0: {
        x = point[0] - Math.sqrt(Math.pow(offset, 2) / (1 + (1 / Math.pow(slope, 2))))
        y = point[1] + Math.sqrt(Math.pow(offset, 2) / (Math.pow(slope, 2) + 1))
        break;
      }
      case 1: {
        x = point[0] + Math.sqrt(Math.pow(offset, 2) / (1 + (1 / Math.pow(slope, 2))))
        y = point[1] + Math.sqrt(Math.pow(offset, 2) / (Math.pow(slope, 2) + 1))
        break;
      }
      case 2: {
        x = point[0] + Math.sqrt(Math.pow(offset, 2) / (1 + (1 / Math.pow(slope, 2))))
        y = point[1] - Math.sqrt(Math.pow(offset, 2) / (Math.pow(slope, 2) + 1))
        break;
      }
      case 3: {
        x = point[0] - Math.sqrt(Math.pow(offset, 2) / (1 + (1 / Math.pow(slope, 2))))
        y = point[1] - Math.sqrt(Math.pow(offset, 2) / (Math.pow(slope, 2) + 1))
        break;
      }
    }
    
    return [x, y]
  }

  pointToLatLng(array: any[]) {
    let newArray: LatLngCustom[] = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push({ lng: array[0], lat: array[1] })
    }
    return newArray;
  }

  latLngToPoint(array: LatLngCustom[]) {
    let newArray: any[] = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push([array[i].lng, array[i].lat])
    }
    return newArray;
  }

  findDirection(array: any[]) {
    if (array[1][1] >= array[0][1] && array[1][0] >= array[0][0])
      return 0; //positive, positive
    else
      if (array[1][1] <= array[0][1] && array[1][0] >= array[0][0])
        return 1; //positive, negative
      else
        if (array[1][1] <= array[0][1] && array[1][0] <= array[0][0])
          return 2; //negative, negative
        else
          return 3; //negative, positive
  }

}
