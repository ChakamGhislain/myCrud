import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Student, StudentService } from '../services/student.service';
import { StudentModalPage } from '../student-modal/student-modal.page';

@Component({
  selector: 'app-homes',
  templateUrl: './homes.page.html',
  styleUrls: ['./homes.page.scss'],
})
export class HomesPage implements OnInit {

  students: Student[];

  constructor(
    private service: StudentService, 
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.service.getAll().subscribe(reponse =>{
      this.students = reponse;
    });
  }

  addStudent(){
    this.modalCtrl.create({
      component: StudentModalPage
    })
    .then(modal =>{
      modal.present();
      return modal.onDidDismiss();
    })
    .then(({data, role}) =>{
      if(role == 'Created'){
        this.students.push(data);
      }
    });
  }

  updateStudent(student: Student){
    this.modalCtrl.create({
      component: StudentModalPage,
      componentProps: {student} //shothand of {student: student}
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role}) =>{
      this.students = this.students.filter(std =>{
        if(data.id == std.id){
          return data; //return updated student
        }
        return std;
      })
    })
  }

  removeStudent(id: string){
    this.alertCtrl.create({
      header: 'Delete',
      message: 'Are you sure you want to delete ?',
      buttons:[{
        text: 'Yes',
        handler: ()=>{
          this.service.remove(id).subscribe(() =>{
            this.students = this.students.filter(std => std.id !== id);
          });
        }
      }, {text: 'No'}]
    })
    .then(alertEl => alertEl.present());
  }

}
