import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Category } from "./team.service";
import { VolunteerRequirements } from "./registration-config.service";
export type EventType = 'ROAD' | 'TRAIL' | 'SPRINT' | 'SUNSET' | 'TRAIL_SPRINT';

@Injectable({
    providedIn: 'root',
  })

  export class CategoryService {

    /* @ngInject */
    constructor () {}

    getCategories (eventType: string)  {
        let eventTypes : Array<Category> = [
            'REGULAR',
            'ULTRA',
            'HIGH_SCHOOL',
            'BLACK_LOOP',
            // 'SIX_PACK',
        ];

        if(eventType && this.isBlackRemoveFromEvent(eventType)) {
            eventTypes.splice(eventTypes.indexOf('BLACK_LOOP'), 1);
            return eventTypes;
        }
        return eventTypes;
    }

    getCategoryRunnersMax (eventType: string, category: Category) : number {
        let eventTypes:any = {
            'ROAD' : {
                'REGULAR': 12,
                'ULTRA': 6,
                'HIGH_SCHOOL': 12,
            },
            'TRAIL' : {
                'REGULAR': 8,
                'ULTRA': 4,
                'HIGH_SCHOOL': 8,
                'BLACK_LOOP' : 2
            },
            'SPRINT' : {
                'REGULAR': 6,
                'ULTRA': 3,
                'HIGH_SCHOOL': 6,
            },
            'SUNSET' : {
                'REGULAR': 4,
                'ULTRA': 2,
                'HIGH_SCHOOL': 4,
                'BLACK_LOOP' : 2
            },
            'TRAIL_SPRINT': {
                'REGULAR': 3,
                'ULTRA': 2,
                'HIGH_SCHOOL': 3,
                'BLACK_LOOP' : 2
            }
        }
        return eventTypes[eventType][category];
    }

    getCategoryVolunteersMax(category: Category, volunteerRequirements: VolunteerRequirements, regPeriod: string): number {
        if(regPeriod)
            return (volunteerRequirements && volunteerRequirements.types && volunteerRequirements.types[category][regPeriod]) || 0;
        else
            return (volunteerRequirements && volunteerRequirements.types && volunteerRequirements.types[category]) || 0;
    }

    getBlackLoopContainEventType() {
        return [
            'TRAIL'
        ];
    }

    isBlackRemoveFromEvent(eventType : String) : boolean {
        let eventTypes = this.getBlackLoopContainEventType();
        if(eventTypes.indexOf(<EventType>eventType) === -1) {
            return true;
        }
        return false;
    }


}