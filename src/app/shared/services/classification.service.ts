import { Injectable } from "@angular/core";
import { BaseDataService } from "./base.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { EventType } from "../constants/local-storage.const";
import { RequestService } from "./request.service";

@Injectable({
    providedIn: 'root',
  })
    export class TeamClassification {
        id: string
        name: string

        init (data?: any) : void {
            if (data) {
                this.id = data["id"];
                this.name = data["name"];
            }
        }

        static fromJS (data: any) : TeamClassification {
            let result = new TeamClassification();
            result.init(data);
            return result;
        }

        toJSON (data?: any) : Object {
            data = typeof data === 'object' ? data : {};

            data["id"] = this.id;
            data["name"] = this.name;

            return data; 
        }
    }

    @Injectable({
        providedIn: 'root',
      })
    export class TeamClassificationDataService extends BaseDataService  {
        /* @ngInject */
        constructor (
                     private RequestService: RequestService, private http:HttpClient) {
            super();
        }

        getDefaultClassifications (type: EventType) : TeamClassification[] {
            return [
                TeamClassification.fromJS({
                    name: 'Men'
                }),
                TeamClassification.fromJS({
                    name: 'Women'
                }),
                TeamClassification.fromJS({
                    name: 'Mixed'
                })
            ];
        }

        createTeamClassification (regConfigId: string, teamClassification: TeamClassification){

            let url = environment.teamsBaseUrl + '/' + regConfigId + '/classifications'

            return this.http.post(url,teamClassification).toPromise();
            // let request = {
            //     url: environment.teamsBaseUrl + '/:regConfigId/classifications',
            //     data: teamClassification,
            //     params: {
            //         regConfigId: regConfigId
            //     }
            // };

            // return this.transformOptions(request).then((request:any) => {
            //     return this.RequestService.post(request);
            // }).then((result:any) => {
            //     return CustomFieldsGroup.fromJS(result);
            // });
        }

        updateTeamClassification (regConfigId: string, teamClassification: TeamClassification){

            let  url = environment.teamsBaseUrl + '/' + regConfigId + '/classifications/' +teamClassification.id;
            return this.http.put(url,teamClassification).toPromise();

            // let request = {
            //     url: environment.teamsBaseUrl + '/:regConfigId/classifications/:classificationId',
            //     data: teamClassification,
            //     params: {
            //         regConfigId: regConfigId,
            //         classificationId: teamClassification.id
            //     }
            // };

            // return this.transformOptions(request).then((request:any) => {
            //     return this.RequestService.put(request);
            // }).then((result:any) => {
            //     return CustomFieldsGroup.fromJS(result);
            // });
        }

        deleteTeamClassification (regConfigId: string, teamClassificationId: string) {
            let request = {
                url: environment.teamsBaseUrl + '/:regConfigId/classifications/:classificationId',
                params: {
                    regConfigId: regConfigId,
                    classificationId: teamClassificationId
                }
            };

            return this.RequestService.delete(request)
            // return this.transformOptions(request).then((request:any) => {
            //     return this.RequestService.delete(request).then(() => {
            //         return DeleteResponse.fromJS({});
            //     })
            // });
        }

        getTeamClassifications (regConfigId: string)  {
            let request = {
                url: environment.teamsBaseUrl + '/:regConfigId/classifications',
                params: {
                    regConfigId: regConfigId
                }
            };
            
            

            return this.RequestService.get(request);
            // this.RequestService.get(request).then((response:any) => {
            //         let result = null;

            //     if (Array.isArray(response)) {
            //         result = [];

            //         for (let item of response) {
            //             result.push(TeamClassification.fromJS(item));
            //         }
            //     }
            //     console.log(result,'resylt');
            //     return result;

            // })
            // return this.transformOptions(request).then((request:any) => {
                // return this.RequestService.get(request);
            // }).then((data:any) => {
            //     let result = null;

            //     if (Array.isArray(data)) {
            //         result = [];

            //         for (let item of data) {
            //             result.push(TeamClassification.fromJS(item));
            //         }
            //     }

            //     return result;
            // });
        }
    }
