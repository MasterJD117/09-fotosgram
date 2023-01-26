import { Component, Input, OnInit, ViewChild } from '@angular/core';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {
  
  @Input() coords: string | undefined = '';
  @ViewChild('mapa', { static: true }) mapa: any;

  constructor() {}

  ngOnInit() {
    console.log('coords:',this.coords);
    
    const latLng = this.coords?.split(',');
    const lat = Number(latLng![0]);
    const lng = Number(latLng![1]);

    mapboxgl.accessToken =
      'pk.eyJ1IjoibWFzdGVyamQiLCJhIjoiY2xkOWQ2aG9zMDdzdzN2cGhseGtoY2o1YSJ9.McCJryzSp_mxgtayvRPVhQ';
    const map = new mapboxgl.Map({
      container: this.mapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 15, // starting zoom
    });

    const marker = new mapboxgl.Marker()
      .setLngLat( [lng, lat] )
      .addTo( map );
  }
}
