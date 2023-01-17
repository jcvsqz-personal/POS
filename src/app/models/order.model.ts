import firebase from 'firebase/compat/app'
import IItem from './item.model'
export default interface IOrder{
    orderId: string,
    item: IItem[],
    timestamp: firebase.firestore.FieldValue,
    cashier: string,
    uid: string,
    vat: number,
    net: number,
    total: number
}