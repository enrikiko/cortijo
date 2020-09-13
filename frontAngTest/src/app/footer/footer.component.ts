import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  active:       String = "normal"
  status:         Boolean  = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.statusEventEmitter().subscribe(status => this.changeLoginResult(status));
    this.auth.statusEventEmitter().subscribe(status => this.changeLoginResult(status));
  }

  changeLoginResult(status){this.status=status}
  normal(){this.active="normal"}
  off(){this.active="off"}
  alarm(){this.active="alarm"}

}
