import { Component } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  
  captainFields: FormlyFieldConfig[] =[
    {
      key: 'Teams',
      type: 'input',
      props: {
        label: 'Team Name',
        placeholder: 'Enter team name',
        required: true,
      },
    }
  ]
}
