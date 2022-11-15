import React, { useState } from 'react';
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrFormSubtract } from 'react-icons/gr';
import { MdShoppingCart } from 'react-icons/md';
import debug from 'sabio-debug';
import 'rc-pagination/assets/index.css';
import PropTypes from 'prop-types';

const _logger = debug.extend('MenuCard');

const AddToCart = ({ notifyMenuCard }) => {
    const [orderQuantity, setOrderQuantity] = useState(1);

    const onAddToCart = () => {
        notifyMenuCard(orderQuantity);
        _logger('Clicked');
    };

    const increment = () => {
        setOrderQuantity((prevState) => {
            let qty = prevState;
            if (qty < 100) {
                let newQty = qty + 1;
                return newQty;
            } else return qty;
        });
    };

    const decrement = () => {
        setOrderQuantity((prevState) => {
            let qty = prevState;
            if (qty > 1) {
                let newQty = qty - 1;
                return newQty;
            } else return qty;
        });
    };

    return (
        <div className="buttons mx-auto">
            <ButtonGroup className="me-1 my-1">
                <OverlayTrigger key="bottm" placement="bottom" overlay={<Tooltip>Subtract</Tooltip>}>
                    <Button variant="light" onClick={decrement}>
                        <GrFormSubtract />
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Quantity</Tooltip>}>
                    <Button variant="light" value={orderQuantity}>
                        {orderQuantity}
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Add</Tooltip>}>
                    <Button variant="light" onClick={increment}>
                        <AiOutlinePlus />
                    </Button>
                </OverlayTrigger>
            </ButtonGroup>

            <Button variant="primary" onClick={onAddToCart}>
                <MdShoppingCart className="font-20" />
                Add To Cart
            </Button>
        </div>
    );
};
AddToCart.propTypes = {
    cardData: PropTypes.shape({
        id: PropTypes.number,
    }).isRequired,
    notifyMenuCard: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
};
export default AddToCart;
