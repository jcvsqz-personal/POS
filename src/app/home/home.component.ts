import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app'
import IItem from '../models/item.model';
import { v4 as uuid } from 'uuid'
import { OrderService } from '../services/order.service';
import IOrder from '../models/order.model';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showAlert = false
  user: firebase.User | null = null
  alertColor = 'blue'
  alertMsg = 'Please wait..'
  isSubmitting = false
  itemTotal:number  = 0;
  vat: number =  0;
  net: number = 0;
  items = [
    {
      price: 29.99,
      name: 'Apple',
      image: 'apple.png',
      quantity: 1
    },
    {
      price: 35.00,
      name: 'Orange',
      image: 'orange.png',
      quantity: 1
    },
    {
      price: 40.00,
      name: 'Lemon',
      image: 'lemon.png',
      quantity: 1
    },
  ]
  cartItems: IItem[] = []

  constructor(private orderService: OrderService, public auth: AuthService, private authFB: AngularFireAuth) {
    authFB.user.subscribe(user => this.user = user)
  }

  ngOnInit(): void {
  }

  addToCart(item: IItem) {
    this.showAlert= false
    let toInsertItem = {
      name: item.name,
      price: item.price,
      quantity: 1,
      total: item.price
    }

    const found = this.cartItems.find((obj) => {
      return obj.name === item.name
    })

    if(found){
      this.cartItems.forEach(element => {
        if(element.name === item.name){
          element.quantity += 1
          element.total = element.quantity * element.price
        }
      });
    }else{
      this.cartItems.push(toInsertItem)
    }
    this.computeVat()

    console.log(this.itemTotal)
  }

  computeVat(){
    this.itemTotal = 0;
    this.cartItems.forEach(element => {
      let holder  = element?.total ? element?.total : 0
      this.itemTotal = this.itemTotal + holder
    })

    const vatableSales = this.itemTotal* 0.12
    this.vat =vatableSales
    this.net = this.itemTotal+this.vat
  }
  placeOrder(){
    
    this.isSubmitting = true
    if(!this.cartItems || this.cartItems.length == 0){
      
      this.showAlert= true
      this.alertColor = 'red'
      this.alertMsg = 'Oops no items on the cart'

      setTimeout(() => {
        this.showAlert= false
        this.alertColor = 'blue'
        this.alertMsg = 'Please wait'
      },5000)

      this.isSubmitting = false
      return
    }

    this.showAlert= true
    this.alertColor = 'blue'
    this.alertMsg = 'Sending order..'
    console.log()
    const orderId = uuid()
    const order: IOrder = {
      orderId: orderId,
      item: this.cartItems,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      cashier: this.user?.displayName as string,
      uid: this.user?.uid as string,
      vat: this.vat,
      net: this.net,
      total: this.itemTotal
    }

    try{
      this.orderService.createOrder(order).then(() => {
        this.isSubmitting = false
        this.showAlert= true
        this.alertColor = 'green'
        this.alertMsg = 'Order placed'
  
        setTimeout(() => {
          this.showAlert= false
          this.alertColor = 'blue'
          this.alertMsg = 'Please wait'
        },5000)
  
        this.cartItems = []
        this.itemTotal = 0
        this.vat = 0
        this.net = 0
      })
    }catch(e){
      this.isSubmitting = false
      this.showAlert= true
      this.alertColor = 'red'
      this.alertMsg = 'Error! Please try again later'

      setTimeout(() => {
        this.showAlert= false
        this.alertColor = 'blue'
        this.alertMsg = 'Please wait'
      },5000)

      this.cartItems = []
      this.itemTotal = 0
      this.vat = 0
      this.net = 0
    }
    
  }

  removeItems(){
    this.cartItems = []
    this.itemTotal = 0
    this.vat = 0
    this.net = 0
  }

  itemCheck(item: IItem) {
    console.log(item.quantity)
    if(item.quantity === 0 || item.quantity === undefined || item.quantity === null) {
      
      this.cartItems = this.cartItems.filter((element) => {
        return element.name !== item.name
      })

      this.computeVat()
    }else{
      item.total = item.quantity * item.price
      this.computeVat()
    }
  }
}
