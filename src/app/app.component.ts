import { Component, OnInit } from '@angular/core';
import { OffsetService } from './offset.service';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private offsetService: OffsetService) {
  }
  ngAfterViewInit(): void {
    this.initMap()
  }

  private map;
  ngOnInit(): void {
    //this.offsetService.generateOffset([[0,0],[1,1],[2,2],[3,3],[4,3],[5,3],[6,3]], 1)
    //this.offsetService.generateOffset([{ lng: 5, lat: 10 }], 3)
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [0.8282, 0.5795],
      zoom: -3,
      crs: L.CRS.Simple
    });

    // const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 19,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

    // tiles.addTo(this.map);

    var polylinePoints = [
      [0, 0],
      [50, 50],
      [100,100],
      [200,200],
      [300,200],
      [400,200],
      [500,200],
      [600,100],
      [700,100],
      [800,100],
      [900,100],
      [1000,100],
      [1100,100]
    ];
    var polyline = L.polyline(polylinePoints).addTo(this.map);

    
    var polyline = L.polyline(this.offsetService.generateOffset(polylinePoints,10)
    ,{color: "red"}).addTo(this.map);
  }
}
