import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Card, Button, Offcanvas, Image, Badge } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import debug from 'sabio-debug';
import 'rc-pagination/assets/index.css';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import cartService from '../../services/cartService';

const _logger = debug.extend('PreCartMenu');

const CartPreview = ({ cart, isShown, toggle }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState({ items: [], alteredItems: [] });
    const [summary, setSummary] = useState({
        total: 0,
    });
    useEffect(() => {
        const items = cart.items;
        const alteredItems = cart.alteredItems;
        for (const item of items) {
            item.total = Number(item.quantity) * Number(item.price);
        }
        setItems((prevState) => {
            let localItems = { ...prevState };
            localItems.items = items;
            localItems.alteredItems = alteredItems;
            return localItems;
        }, []);
    }, [cart]);

    useEffect(() => {
        setSummary((prevState) => {
            let sum = { ...prevState };
            let totalCart = [];
            totalCart = [...items?.items, ...items?.alteredItems];
            if (totalCart && totalCart.length > 0) {
                const total = totalCart.reduce((accumulator, item) => {
                    return accumulator + item.total;
                }, 0);
                sum.total = Number(total).toFixed(2);
            } else {
                sum.total = 0.0;
            }
            return sum;
        });
    }, [items.items.length, items.alteredItems.length]);
    const onDeleteError = (err) => {
        toastr.error('There was an error, item not removed.');
        _logger(err);
    };
    const onDeleteClicked = (e) => {
        const onDeleteSuccess = () => {
            setItems((prevState) => {
                let cartItems = [...prevState];
                const remainingCart = cartItems.filter((item) => Number(item.cartItemId) !== Number(e.target.id));
                cartItems = remainingCart;
                return cartItems;
            });
        };
        cartService.deleteByid(Number(e.target.id)).then(onDeleteSuccess).catch(onDeleteError);
    };
    const navToCart = () => {
        const state = { type: 'order_Data', payload: cart.navData };
        navigate('/cart', { state: state });
    };

    const mapRows = (item, index) => {
        return (
            <tr key={item.id + index}>
                <td>
                    <Image src={item?.imageUrl} fluid></Image>
                </td>
                <td>{item?.name}</td>
                <td>{item?.quantity}</td>
                <td>
                    <FaTrash id={item?.cartItemId} onClick={onDeleteClicked}></FaTrash>
                </td>
            </tr>
        );
    };
    const mapModdedRows = (item, index) => {
        return (
            <tr key={item.id + index}>
                <td>
                    <Image src={item?.imageUrl} fluid></Image>
                    {
                        <Badge pill className="me-1 bg-secondary">
                            Modified
                        </Badge>
                    }
                </td>
                <td>{item?.name}</td>
                <td>{item?.quantity}</td>
                <td>
                    <FaTrash id={item?.cartItemId} onClick={onDeleteClicked}></FaTrash>
                </td>
            </tr>
        );
    };
    return (
        <>
            <Offcanvas show={isShown} onHide={toggle} name="top" placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <Card.Body>
                                    <Row lg={3}>
                                        <Col lg={12}>
                                            {' '}
                                            <div className="border p-2 mt-4 mt-lg-0 rounded">
                                                <h4 className="header-title mb-3">Cart Preview</h4>
                                                <Table responsive className="mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <b>Item</b>
                                                            </td>
                                                            <td>
                                                                <b>Qty</b>
                                                            </td>
                                                        </tr>
                                                        {items?.alteredItems?.map(mapModdedRows)}
                                                        {items?.items?.map(mapRows)}
                                                        <tr>
                                                            <th>Total :</th>
                                                            <th>${summary.total}</th>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                            <div className="mt-3">
                                                <Button variant="danger" value="1" onClick={navToCart}>
                                                    Go to Cart
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

CartPreview.propTypes = {
    cart: PropTypes.shape({
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
            })
        ),
        alteredItems: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
            })
        ),
        navData: PropTypes.shape({
            itemId: PropTypes.arrayOf(PropTypes.number),
            userId: PropTypes.number,
            orgId: PropTypes.string,
        }),
    }).isRequired,
    isShown: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
};

export default CartPreview;
