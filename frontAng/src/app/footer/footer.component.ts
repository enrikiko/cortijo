import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  active: string="normal"

  constructor() { }

  ngOnInit() {
  }

  normal(){this.active="normal"}
  off(){this.active="off"}
  alarm(){this.active="alarm"}

}
