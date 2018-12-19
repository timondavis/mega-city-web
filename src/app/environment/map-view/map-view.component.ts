import {Component, OnInit} from '@angular/core';
import { Initializer } from '../../game/Initializer';
import {Game} from '../../game/Game/Game';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    Initializer.Initialize('mapViewCanvas');
  }
}
