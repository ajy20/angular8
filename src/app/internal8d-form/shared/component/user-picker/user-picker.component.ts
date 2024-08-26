import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GraphService } from '../../../../shared/services/graph.service';
import { User } from 'src/app/models/user';
import { UserDetailsService } from '../../services/user-details.service';

@Component({
  selector: 'app-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.css']
})
export class UserPickerComponent implements OnInit {
  results: any;
  keyword: string = 'userPrincipalName';
  crossIconFlag: boolean = false;
  loadingGraphUserFlag: boolean = false;

  constructor(
    private graphSvc: GraphService,
    private userDetails: UserDetailsService
  ) { } 

  ngOnInit() {
  }

  onChangeSearch(val: string) {
    this.crossIconFlag = false;
    this.loadingGraphUserFlag = true;
    if (val) {
      this.graphSvc.getEvents(val.toLowerCase()).then((events) => {
        this.results = events;
        if (this.results == undefined || this.results.length == 0) {
          this.loadingGraphUserFlag = false;
        }
      });
    }
  }


  

  selectSearchEvent(item) {

    let userData = {
      displayName: item.displayName,
      mail: item.mail,
      jobTitle: item.jobTitle,
      mobilePhone: item.mobilePhone,
      globalId: item.userPrincipalName.split('@')[0]
    }
    console.log("selectEvent ", userData);

    this.userDetails.getSelectedUserDetails(userData);


  }

  inputClearSearch() {
    // this.user.email = "";
    // this.user = <User>{};
  }


}
