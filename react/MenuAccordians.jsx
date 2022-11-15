import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import { getMenusV2 } from '../../services/menusService.js';
import { useEffect } from 'react';
import SectionAccordion from './SectionAccordion';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
const _logger = debug.extend('MobileMenu');

const MenusAccordion = ({ item, onOrderClicked, collapseCount, userId, onToggle }) => {
    const [menus, setMenus] = useState({ orgs: [{ id: '', name: '' }] });
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (item.id) {
            getMenusV2(item.id, 0, 15).then(onGetMenusSuccess).catch(onGetMenusError);
        }
    }, [item]);
    _logger(item, 'Item in MenuAccordion');

    const onGetMenusSuccess = (response) => {
        setMenus((prevState) => {
            const newMenus = { ...prevState };
            _logger(newMenus.id);
            newMenus.menus = response.item.pagedItems;
            if (newMenus.menus.length <= 0) {
                toastr.error('No menus currently available.');
            }
            setIsLoading(false);
            return newMenus;
        });
    };
    const onGetMenusError = (error) => {
        toastr.error('No menus currently available.');
        _logger(error);
    };

    const mapMenus = (menu) => {
        _logger('mapmen');
        if (menu.menuItems) {
            return (
                <SectionAccordion
                    className="text-center"
                    key={`${menu.id}`}
                    item={menu}
                    collapseCount={collapseCount}
                    userId={userId}
                    handleOrder={onOrderClicked}
                    onToggle={onToggle}>
                    {menu.name}
                </SectionAccordion>
            );
        }
    };

    return (
        <Accordion className="fw-bold mx-0 accordion-header text-center p-0" flush defaultActiveKey={null}>
            <Accordion.Item eventKey="1">
                <Accordion.Header
                    name={item.id}
                    className="fw-bold p-0 menu-section-accordion mx-0 accordion-header text-center">
                    <img className="org-menu-logo" src={item.logo} height={37} alt="logo"></img>
                    {item.name}
                </Accordion.Header>
                <Accordion.Body className="p-0">
                    {isLoading ? <div className="spinner-border" /> : menus.menus && menus.menus.map(mapMenus)}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

MenusAccordion.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        logo: PropTypes.string,
    }).isRequired,
    onOrderClicked: PropTypes.func.isRequired,
    collapseCount: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    onToggle: PropTypes.func.isRequired,
};

const Accordions = ({ org, onItemClick, collapseCount, userId, onToggle }) => {
    _logger(collapseCount, typeof collapseCount);

    return (
        <>
            <MenusAccordion
                key={org.id}
                item={org}
                logo={org.logo}
                collapseCount={collapseCount}
                onOrderClicked={onItemClick}
                onToggle={onToggle}
                userId={userId}></MenusAccordion>
        </>
    );
};
Accordions.propTypes = {
    org: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number,
        logo: PropTypes.string,
    }).isRequired,
    onItemClick: PropTypes.func.isRequired,
    collapseCount: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default React.memo(Accordions);
