import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Modal } from 'react-bootstrap';
import { useWebshopStateMachine } from '../../webshop/useWebshopStateMachine';
import Link from 'next/link';
import styles from './cart.module.scss';

export default function Cart({ checkoutPage = false }) {
    const [state, dispatch] = useWebshopStateMachine();
    const [showPaymenyModal, setShowPaymentModal] = useState(false);

    function increment(itemId) {
        dispatch({ type: 'INCREMENT_ITEM_QUANTITY', itemId });
    }

    function decrement(itemId, quantity) {
        if (quantity === 1) {
            dispatch({ type: 'REMOVE_ITEM_FROM_CART', itemId });
            return null;
        }
        dispatch({ type: 'DECREMENT_ITEM_QUANTITY', itemId });
    }

    function removeItem(itemId) {
        dispatch({ type: 'REMOVE_ITEM_FROM_CART', itemId });
    }

    function clearCart() {
        dispatch({ type: 'CLEAR_CART' });
    }

    function checkout() {
        setShowPaymentModal(true);
        dispatch({ type: 'CHECKOUT' });
    }

    useEffect(() => {
            dispatch({ type: 'FETCH_ORDER' });
    }, []);
    
    if (state.cart === {}) {
        return null;
    }

    return (
        <Card>
            <div className="p-4">
            <ItemInCheckout state={state} decrement={decrement} increment={increment} removeItem={removeItem} />
            </div>
            <Row className="p-4">
                <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button style={{marginRight: '12px'}} variant="outline-danger"onClick={clearCart}>Clear cart</Button>
                    {checkoutPage ? 
                    <Button onClick={checkout}>Checkout</Button> : (
                    <Link href="/checkout">
                    <Button>Checkout</Button>
                    </Link>
                    )}
                </Col>
            </Row>
            <PaymentModal 
                show={showPaymenyModal} 
                handleClose={() => 
                setShowPaymentModal(false)} 
                state={state} 
                dispatch={dispatch} />
        </Card>
    )
}

function PaymentModal(props) {
    const { show, handleClose, state} = props; 

    useEffect(() => {
        if (state.status === 'index') {
            handleClose();
        }
    }, [state.status]);
  
    return (
        <Modal show={show}>
          <Modal.Header style={{maxWidth: '1000px'}}>
            <Modal.Title>Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{maxWidth: '1000px'}}>
           {state.status === 'pendingPurchase' && (
               <h5>Pending purchase</h5>
           )}
            {state.status === 'pendingPayment' && (
               <h5>Pending Payment</h5>
           )}
            {state.status === 'purchaseCompleted' && (
               <h5>Purchase completed</h5>
           )}
            </Modal.Body>
        </Modal>
   
    );
  }

function ItemInCheckout(props) {
    const { state, increment, decrement, removeItem } = props;
     
    const item = Object.keys(state.cart).map(itemId => (
            <Card.Text key={state.cart[itemId].id} className={styles.itemRow}>
                <span style={{fontSize: '18px', fontWeight: 'bold'}}>{state.cart[itemId].name}</span>
                <span>
                <Button 
                    onClick={() => decrement(itemId, state.cart[itemId].quantityInCart)}
                    variant="outline-secondary"
                    className={styles.incrementDecrementButton} 
                >
                    <span className={styles.decrementOperand}>
                        -
                    </span>
                </Button>
                {state.cart[itemId].quantityInCart}
                <Button 
                    onClick={() => increment(itemId)}
                    variant="outline-secondary"
                    className={styles.incrementDecrementButton} 
                    >
                    <span className={styles.incrementOperand}>
                        +
                    </span>
                </Button>
                <Button onClick={() => removeItem(itemId)} variant="outline-danger" style={{marginLeft: '20px'}}>Remove</Button>
                </span>
            </Card.Text>  
            )
        );

        return item
    }
