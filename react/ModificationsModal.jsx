import React, { useEffect, useState } from 'react';
import { Button, Modal, Col, Card, ButtonGroup, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';
import menuItemService from '../../services/menuItemsService';
import Select from 'react-select';
import debug from 'sabio-debug';
import toastr from 'toastr';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrFormSubtract } from 'react-icons/gr';

const _logger = debug.extend('MobileMenuMainn');
const ModificationsModal = ({ modalState, onToggle, onAddModifiedOrder }) => {
    const [options, setOptions] = useState({
        ingredients: [],
        modifications: [],
        displayIng: [],
    });
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        menuItemService
            .getModificationOptionsByItemId(modalState?.menuItem.id)
            .then(onGetModsSuccess)
            .catch(onGetModsError);
    }, []);
    useEffect(() => {
        if (options?.ingredients) {
            setOptions((prevState) => {
                const newOpt = { ...prevState };
                if (newOpt?.ingredients?.length >= 1) {
                    newOpt.ingredients = [...newOpt?.ingredients];
                    newOpt.displayIng = newOpt.ingredients.map(mapIngredients);
                }
                return newOpt;
            });
            setTotalPrice((prevState) => {
                let price = prevState;
                price = options.modifications.reduce(function (accumulator, mod) {
                    return accumulator + mod.costChange;
                }, modalState.menuItem.price);
                return price;
            });
        }
    }, [options.modifications]);

    const onAddtoCart = () => {
        onAddModifiedOrder(options.modifications, modalState.menuItem, totalPrice);
    };
    const onGetModsSuccess = (response) => {
        const items = response.item;
        setLoading(false);
        setOptions((prevState) => {
            const newOptions = { ...prevState };
            newOptions.ingredients = items?.menuItemIngredients;
            newOptions.displayIng = items?.menuItemIngredients?.map(mapIngredients);
            _logger('firing success');
            return newOptions;
        });
        setTotalPrice((prevState) => {
            let price = prevState;
            price = price >= 0 ? price : modalState.menuItem.price;
            return price;
        });
    };

    const handleQuantity = (e) => {
        const ingId = e.currentTarget.id;
        const name = e.currentTarget.name;
        let i = 0;
        setOptions((prevState) => {
            const newOpt = { ...prevState };
            newOpt.ingredients = [...newOpt.ingredients];
            newOpt.modifications = [...newOpt.modifications];
            const idx = newOpt.ingredients.findIndex((ing) => Number(ing?.id) === Number(ingId));
            const altIdx = newOpt.modifications.findIndex((mod) => Number(mod?.id) === Number(ingId));
            if (altIdx < 0 && i < 1 && name === 'increase') {
                const quantityMod = {
                    id: newOpt?.ingredients[idx]?.id || null,
                    menuModificationTypeId: 2,
                    count: 1,
                    menuItemId: modalState?.menuItem?.id,
                    entityId: 1,
                    modificationParentId: 1,
                    name: newOpt?.ingredients[idx]?.name,
                    alternateIngredientId: null,
                };
                quantityMod.costChange = Number(quantityMod.count) * Number(newOpt?.ingredients[idx]?.unitCost);
                newOpt.modifications.push(quantityMod);
            } else if (altIdx >= 0 && i < 1 && name === 'increase') {
                newOpt.modifications[altIdx].count += 1;
                newOpt.modifications[altIdx].costChange =
                    Number(newOpt.modifications[altIdx].count) * Number(newOpt?.ingredients[idx]?.unitCost);
                i++;
            } else if (altIdx >= 0 && i < 1 && name === 'decrease') {
                newOpt.modifications[altIdx].count -= 1;
                newOpt.modifications[altIdx].costChange =
                    Number(newOpt.modifications[altIdx].count) * Number(newOpt?.ingredients[idx]?.unitCost);
                i++;
            }
            newOpt.displayIng = newOpt.ingredients.map(mapIngredients);
            return newOpt;
        });
    };
    const onGetModsError = (err) => {
        toastr.error('There was an error retrieving the modification options.');
        _logger(err);
    };
    const handleChange = (value, e) => {
        _logger(e, value);
        const values = value;
        setOptions((prevState) => {
            const newOptions = { ...prevState };
            newOptions.displayIng = [...newOptions.displayIng];
            newOptions.modifications = [...newOptions.modifications];
            const idx = newOptions.modifications.findIndex(
                (mod) => Number(mod.id) === Number(values?.value?.id) || Number(values?.value?.origId)
            );
            if (e.action === 'select-option' && idx >= 0) {
                newOptions.modifications.splice(idx, 1, values.value);
            } else if (e.action === 'select-option') {
                newOptions.modifications.push(values.value);
            } else if (e.action === 'clear') {
                delete newOptions.modifications[idx];
            }
            newOptions.displayIng = newOptions.ingredients.map(mapIngredients);
            _logger('firing change');
            return newOptions;
        });
    };

    const handleRemoveItem = (e) => {
        _logger(Number(e?.currentTarget?.id), options.ingredients);
        const idx = options.ingredients.findIndex((ing) => Number(ing.id) === Number(e.currentTarget.id));
        setOptions((prevState) => {
            const newOpt = { ...prevState };
            newOpt.ingredients = [...newOpt.ingredients];
            newOpt.modifications = [...newOpt?.modifications];
            const altIdx = newOpt?.modifications?.findIndex((mod) => Number(mod?.id) === Number(e?.currentTarget?.id));
            const removeMod = {
                id: newOpt?.ingredients[idx]?.id || null,
                menuModificationTypeId: 3,
                count: newOpt?.ingredients[idx]?.quantity,
                menuItemId: modalState?.menuItem?.id,
                entityId: 1,
                modificationParentId: 1,
                costChange: -newOpt?.ingredients[idx]?.unitCost,
                alternateIngredientId: null,
            };
            if (idx >= 0) {
                newOpt.ingredients.splice(idx, 1);
            }
            if (altIdx >= 0) {
                newOpt.modifications.splice(altIdx, 1, removeMod);
            } else {
                newOpt.modifications.push(removeMod);
            }

            return newOpt;
        });
    };
    const mapIngredients = (ingredient) => {
        let arrayOfOptions = [];
        if (ingredient.menuItemAlternateIngredients) {
            arrayOfOptions = ingredient.menuItemAlternateIngredients.map(mapSelectOptions);
        }
        const idx = options.modifications.findIndex(
            (mod) => Number(mod.id) === Number(ingredient.id) && Number(mod.modificationTypeId) !== 3
        );
        switch (true) {
            case idx >= 0:
                var ing = options.modifications[idx];
                break;
            default:
                ing = ingredient;
        }
        return (
            <Card className="menu-item-mod-card p-1 d-flex" key={ingredient.id}>
                <Card.Body className="px-0 py-1 d-flex">
                    <Row className="d-flex col-12 p-0 m-0 justify-content-around mx-auto align-items-center">
                        <small className="d-inline-flex  mx-1 px-1">
                            <p className="my-auto">
                                {ing?.name}{' '}
                                <small>${Number(ing?.unitCost) || Number(ing?.costChange / ing?.count)}</small>
                            </p>
                            <ButtonGroup className="modify-order-quantity-button col-7 mx-auto my-1 p-0">
                                <Button
                                    name={`decrease`}
                                    id={ing?.id}
                                    disabled={ing?.count <= 1 || ing.quantity <= 1}
                                    variant="light"
                                    className="p-0"
                                    onClick={handleQuantity}>
                                    <GrFormSubtract />
                                </Button>
                                <Button className="ing-quan-btn p-0" variant="light">
                                    <small>
                                        {ing?.alternateIngredientId ? ing?.count : ing?.quantity || ing?.count + 1}
                                    </small>
                                </Button>
                                <Button
                                    name={`increase`}
                                    id={ing?.id}
                                    variant="light"
                                    className="p-0"
                                    onClick={handleQuantity}>
                                    <AiOutlinePlus />
                                </Button>
                            </ButtonGroup>
                            <p className="my-auto" name={ing?.name} id={ing?.alternateIngredientId || ing.origId}>
                                <FaTrash
                                    name={ing?.id || ing.origId}
                                    id={ingredient.id}
                                    onClick={handleRemoveItem}
                                    className="ml-auto"
                                />
                            </p>
                        </small>
                    </Row>
                </Card.Body>
                {ingredient?.menuItemAlternateIngredients && (
                    <Row>
                        <Select
                            id={ingredient.id}
                            name={ingredient.name}
                            placeholder="Select a substitute"
                            options={arrayOfOptions}
                            isClearable={true}
                            onChange={handleChange}
                            className="react-select"></Select>
                    </Row>
                )}
            </Card>
        );
    };
    const mapSelectOptions = (ingredient) => {
        return {
            label: ingredient.name,
            value: {
                id: ingredient.originalId,
                costChange: ingredient.costOverride,
                menuItemId: modalState.menuItem.id,
                alternateIngredientId: ingredient.id,
                entityId: 1,
                menuModificationTypeId: 1,
                modificationParentId: 1,
                count: 1,
                name: ingredient.name,
            },
        };
    };

    return (
        <>
            <Modal show={modalState.isOpen} onHide={onToggle} size="lg" className="text-dark p-0 m-0">
                <Modal.Header closeButton className="bg-primary">
                    <h3 className="modal-title text-center text-light">Customize your order!</h3>
                </Modal.Header>
                <Modal.Body className="text-dark p-0 m-0">
                    {loading ? (
                        <div className="spinner-border mx-auto" />
                    ) : (
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mt-2">
                            <Row>
                                <h4 className="text-center">Total: ${totalPrice > 0 && totalPrice} </h4>
                            </Row>
                            {options?.displayIng && options?.displayIng}
                        </Col>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex">
                    <Button variant="success" onClick={onAddtoCart}>
                        Add to Cart
                    </Button>
                    <Button variant="secondary" onClick={onToggle}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

ModificationsModal.propTypes = {
    modalState: PropTypes.shape({
        menuItem: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            price: PropTypes.number,
        }),
        isOpen: PropTypes.bool,
    }).isRequired,
    onToggle: PropTypes.func.isRequired,
    onAddModifiedOrder: PropTypes.func.isRequired,
};

export default React.memo(ModificationsModal);
