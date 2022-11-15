import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import { useEffect } from 'react';
import MenuItemCard from './MenuItemCard';

const _logger = debug.extend('MobileMenu');

const MenuList = ({ section, items, clickOrder, userId, collapseCount, menu, onToggle }) => {
    const [menuItems, setMenuItems] = useState({
        menuItems: [],
    });

    const checkItems = (itemTag) => itemTag.name.includes(section);
    false && _logger(collapseCount);
    useEffect(() => {
        setMenuItems((prevState) => {
            let newItems = { ...prevState };
            if (items) {
                newItems.menuItems = items.filter((item) => (item?.tags ? item.tags.some(checkItems) : null));
            }
            return newItems;
        });
    }, []);

    const mapMenuItems = (item) => {
        return (
            <MenuItemCard
                key={`${section}${item.id}${menu.id}`}
                item={item}
                menu={menu}
                section={section}
                onToggle={onToggle}
                onPurchaseMenuItem={clickOrder}
                userId={userId}
            />
        );
    };

    return (
        <Accordion flush key={section + Math.random() * 10}>
            <Accordion.Item eventKey="1">
                <Accordion.Header className="mb-1 menu-section-accordion">{section}</Accordion.Header>
                <Accordion.Body className="p-0">
                    <div className="menu-item-display-div p-0">
                        {menuItems && menuItems.menuItems.map(mapMenuItems)}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

MenuList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            imageUrl: PropTypes.string,
            price: PropTypes.number,
            description: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    clickOrder: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    collapseCount: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    menu: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default React.memo(MenuList);
