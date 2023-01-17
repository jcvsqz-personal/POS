import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IOrder from '../models/order.model';
import { ClipService } from '../services/clip.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = []
  orderOrder = '1'
  activeClip: IOrder | null = null
  sort$: BehaviorSubject<string> 
  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private clipsService: ClipService,) {
      this.sort$ = new BehaviorSubject(this.orderOrder)
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.orderOrder = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.orderOrder)
    })
  
    this.orderService.getUserOrders(this.sort$).subscribe(docs => {
      this.orders = []
      docs.forEach(doc =>{
        this.orders.push(
          doc.data()
        )
      })
    })
  }

  

}
