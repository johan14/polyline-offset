import { Injectable } from '@angular/core';
import { LatLngCustom } from './LatLng';
import * as linSystem from "linear-equation-system"
import * as linearSolve from 'linear-solve'

@Injectable({
  providedIn: 'root'
})
export class OffsetService {

  constructor() { }

  finalArray = []
  intersected: boolean = false;
  temp = []

  generateOffset(array: any[], offset) {


    //array = this.latLngToPoint(array)

    let sameSlope = [];
    let offsetedArray = [];
    let previousCalculated = [[10, 0], [20, 20]];
    let prevSlope = this.newSlope(array[1], array[0]);

    for (let i = 0; i < array.length - 1; i++) {
      if (prevSlope == this.newSlope(array[i + 1], array[i]) && i != array.length - 2) {
        sameSlope.push(array[i]);
      }
      else {
        sameSlope.push(array[i]);
        if (i == array.length - 2)
          sameSlope.push(array[i + 1])
        if (sameSlope.length > 1) {
          let actual = this.calculateOffsetArray(sameSlope, offset);
          //offsetedArray.push(... this.calculateOffsetArray(sameSlope, offset))
          
          this.concatArrays(previousCalculated, actual)

          previousCalculated = this.calculateOffsetArray(sameSlope, offset);
        }
        sameSlope = [];
        sameSlope.push(array[i])
        prevSlope = this.newSlope(array[i + 1], array[i]);
      }
    }
    //return offsetedArray;
    let final = [];
    this.finalArray.forEach(x => {
      final.push(...x)
    })
    final = final.slice(2,final.length)
    return final;
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

  concatArrays(prev: any[], next: any[]) {

    if (this.linesIntersect(prev, next)) {  //NQS VIJAT PRITEN
      let concated = this.partialConcatArrays(prev, next, this.findMutualPoint(prev, next));
      if (this.intersected) {  //NQS KA NJE BASHKIM ME PERPARA
        this.finalArray.pop()
        this.finalArray.push([this.temp[1],concated[0][concated.length-1]], concated[1])
      }else{this.finalArray.push(concated[0], concated[1])}

      this.intersected=true;
      this.temp = concated[1];

    } else{  //BASHKIM I THJESHTE
      if(this.intersected){
        this.finalArray.pop()
        this.finalArray.push([this.temp[0],prev[prev.length-1]],next)
      }
      this.finalArray.push(prev)
      this.intersected=false;
      this.temp=[]
    }
  }

  findMutualPoint(prev: any[], next: any[]) {
    let A: number[][] = [[(-1) * this.newSlope(prev[1], prev[0]), 1], [(-1) * this.newSlope(next[1], next[0]), 1]]

    let b0 = ((-1) * this.newSlope(prev[1], prev[0])) * prev[0][0] + prev[0][1];
    let b1 = ((-1) * this.newSlope(next[1], next[0])) * next[0][0] + next[0][1];
    let B = [b0, b1];
    try {
      return linearSolve.solve(A, B);
    } catch{
      console.log('////////ERROR///////')
    }

  }

  partialConcatArrays(prev: any[], next: any[], mutualPoint) {
    return [[prev[0], mutualPoint], [mutualPoint, next[1]]]
  }

  intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  }

  linesIntersect(prev: any[], next: any[]) {
    return this.intersects(prev[0][0], prev[0][1], prev[1][0], prev[1][1],
      next[0][0], next[0][1], next[1][0], next[1][1]);
  }

}


