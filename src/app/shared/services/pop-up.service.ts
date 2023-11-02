import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(message: string, action?: any | undefined) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }
}
