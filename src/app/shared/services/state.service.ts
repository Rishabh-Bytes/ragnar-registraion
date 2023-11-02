import { Injectable } from "@angular/core";
import * as _ from 'lodash';
@Injectable({
    providedIn: 'root',
})
export class StateService {

    private state: { [key: string]: any }
    private key = 'team-builder.registration.state'

    /* @ngInject */
    constructor() {
        this.state = this.getStorageState();
    }

    getStorageState(): any {
        let state = sessionStorage.getItem(this.key);

        if (state) {
            return JSON.parse(state);
        } else {
            return {};
        }
    }

    setStorageState(state: any): void {
        sessionStorage.setItem(this.key, JSON.stringify(state));
    }

    getState<IState>(key: string): IState {
        return _.has(this.state, key) ? this.state[key] : null;
    }

    setState<IState>(key: string, state: IState): IState {
        return this.state[key] = state;
    }

    flush<IState>(key: string): void {
        let state = this.getStorageState();

        state[key] = this.state[key];

        this.setStorageState(state);
    }

    clear<IState>(key: string): void {
        let state = this.getStorageState();

        this.state[key] = null;
        delete state[key];

        this.setStorageState(state);
    }
}
