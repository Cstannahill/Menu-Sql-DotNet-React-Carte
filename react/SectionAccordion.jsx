import React, { useState, useEffect, memo } from 'react';
import { Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import MenuList from './MenuList';
import debug from 'sabio-debug';

const _logger = debug.extend('MobileMenu');

const SectionAccordion = memo(({ item, handleOrder, collapseCount, userId, onToggle }) => {
    const [tags, setTags] = useState({
        tags: [],
    });
    _logger(item);

    useEffect(() => {
        setTags((prevState) => {
            const menuItems = { ...prevState };
            if (item.menuItems && item.menuItems.tags !== null) {
                item.menuItems.forEach((menuOption) => {
                    if (menuOption.tags) {
                        menuOption.tags.forEach((tag) => {
                            if (!menuItems.tags.includes(tag.name)) {
                                menuItems.tags.push(tag.name);
                            }
                        });
                    }
                });
            }
            return menuItems;
        });
    }, []);

    const mapSections = (tag) => {
        _logger('MappSec');
        return (
            <MenuList
                section={tag}
                userId={userId}
                menu={item.name}
                items={item.menuItems}
                onToggle={onToggle}
                collapseCount={collapseCount}
                key={`${tag}${item.id}`}
                clickOrder={handleOrder}>
                {tag}
            </MenuList>
        );
    };

    return (
        <Accordion className="p-0" flush key={item.name + Math.random()}>
            <Accordion.Item className="p-0" eventKey="1">
                <Accordion.Header className="p-0 menu-section-accordion">{item.name}</Accordion.Header>
                <Accordion.Body className="p-0">{tags && tags.tags && tags.tags.map(mapSections)}</Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
});

SectionAccordion.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        menuItems: PropTypes.arrayOf(
            PropTypes.shape({
                description: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                tags: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.number.isRequired,
                        name: PropTypes.string.isRequired,
                    })
                ),
            })
        ),
    }).isRequired,
    handleOrder: PropTypes.func.isRequired,
    collapseCount: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default React.memo(SectionAccordion);
