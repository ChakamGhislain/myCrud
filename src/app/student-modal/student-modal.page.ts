import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Student, StudentService } from '../services/student.service';

@Component({
  selector: 'app-student-modal',
  templateUrl: './student-modal.page.html',
  styleUrls: ['./student-modal.page.scss'],
})
export class StudentModalPage implements OnInit {

  @Input() student: Student; //For receive data sent
  isUpdate = false;

  //Data to be updated
  data = {
    name: '',
    address: '',
    phone: ''
  };


  constructor(private modalCtrl: ModalController, private service: StudentService) { }

  ngOnInit() {
    if(this.student){
      //if student is nt null it means modal is on update mode
      this.isUpdate = true;
      this.data = this.student;
    }
  }

  onSubmit(form: NgForm){
    const student = form.value;
    if(this.isUpdate){
      this.service.update(student, this.student.id).subscribe(() =>{
        student.id = this.student.id; //append id to the updated student object
        this.modalCtrl.dismiss(student, 'Updated');
      });
    }else{
      this.service.create(student).subscribe(response => {
        //Pass data back and close modal
        this.modalCtrl.dismiss(response, 'Created');
      });
    }
    
  }


  closeModal(){
    this.modalCtrl.dismiss(null, 'Closed');
  }

}
