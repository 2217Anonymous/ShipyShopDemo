import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isSellers, setIsSellers] = useState(false);
    const [isProducts, setIsProducts] = useState(false);
    const [isOrders, setIsOrders] = useState(false);
    const [isPayments, setIsPayments] = useState(false);
    const [isAdminSettings, setIsAdminSettings] = useState(false);
    const [isChat, setIsChat] = useState(false);
    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Sellers') {
            setIsSellers(false);
        }
        if (iscurrentState !== 'Products') {
            setIsProducts(false);
        }
        if (iscurrentState !== 'Orders') {
            setIsOrders(false);
        }
        if (iscurrentState !== 'Payments') {
            setIsPayments(false);
        }
        if (iscurrentState !== 'AdminSettings') {
            setIsAdminSettings(false);
        }
        if (iscurrentState !== 'Chat') {
            setIsChat(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isSellers,
        isProducts,
        isOrders,
        isPayments,
        isAdminSettings,
        isChat,
    ]);

    const menuItems = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "las la-tachometer-alt",
            link: "/#",
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "adminDashboard",
                    label: "Ecommerce",
                    link: "/dashboard",
                    parentId: "dashboard",
                },
            ],
        },

        {
            id: "products",
            label: "Products",
            icon: "lab la-product-hunt",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsSellers(!isProducts);
                setIscurrentState('Products');
                updateIconSidebar(e);
            },
            stateVariables: isProducts,
            subItems: [
                { id: "products", label: "Products", link: "/products", parentId: "product" },
                { id: "addProduct", label: "Add Product", link: "/add-product", parentId: "product" },
                { id: "sellerProduct", label: "Seller Product", link: "/seller-product", parentId: "product" },
                { id: "category", label: "Category", link: "/categories", parentId: "product" },
                { id: "attributes", label: "Attributes", link: "/attributes", parentId: "product" },
            ],
        },
        
        {
            id: "sellers",
            label: "Sellers",
            icon: " ri-shield-user-fill",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsSellers(!isSellers);
                setIscurrentState('Sellers');
                updateIconSidebar(e);
            },
            stateVariables: isSellers,
            subItems: [
                { id: "sellers", label: "Sellers", link: "/sellers", parentId: "sellers", role:"admin" },
            ],
        },

        {
            id: "orders",
            label: "Orers",
            icon: "ri-list-check-2",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsSellers(!isOrders);
                setIscurrentState('Orders');
                updateIconSidebar(e);
            },
            stateVariables: isOrders,
            subItems: [
                { id: "adminOrders", label: "Order List", link: "/orders", parentId: "orders"},
                { id: "sellerOrders", label: "Seller Order List", link: "/seller-orders", parentId: "orders" },
            ],
        },

        // {
        //     id: "payments",
        //     label: "Payments",
        //     icon: " ri-secure-payment-line",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsSellers(!isPayments);
        //         setIscurrentState('Payments');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isPayments,
        //     subItems: [
        //         { id: "payments", label: "Payemnts", link: "/payments", parentId: "payments" },  
        //         { id: "seller-payments", label: "Payemnts", link: "/payments", parentId: "payments" },  
        //     ],
        // },

        // {
        //     id: "adminSettings",
        //     label: "Admin Settings",
        //     icon: "ri-settings-2-line",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsSellers(!isAdminSettings);
        //         setIscurrentState('AdminSettings');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isAdminSettings,
        //     subItems: [
        //         { id: "category", label: "Category", link: "/categories", parentId: "adminSettings" },
        //         { id: "attributes", label: "Attributes", link: "/attributes", parentId: "adminSettings" },
        //     ],
        // },
        // {
        //     id: "chat",
        //     label: "Chat",
        //     icon: "ri-message-2-fill",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsSellers(!isChat);
        //         setIscurrentState('chat');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isChat,
        //     subItems: [
        //         { id: "chatToSeller", label: "Chat To Seller", link: "/master/", parentId: "adminSettings" },
        //         { id: "chatToCustomer", label: "chat To Customer", link: "/master/color", parentId: "adminSettings" },
        //         { id: "chatToAdmin", label: "chat To Admin", link: "/master/meta", parentId: "adminSettings" },
        //     ],
        // },

    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;