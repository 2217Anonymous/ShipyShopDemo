import React, { useCallback, useEffect, useRef, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
    Card,
    CardBody,
    Col,
    Container,
    CardHeader,
    Row,
    Input,
    Label,
    FormFeedback,
    Button,
    Badge,
    CloseButton,
    Table,
    NavLink,
    TabContent,
    TabPane,
    Nav,
    NavItem
} from "reactstrap";
import avatar1 from '../../assets/images/users/avatar-1.jpg';

import Multiselectdropdown from "multiselect-react-dropdown";
import Uploader from "../../Components/image-uploader/Uploader"
import { MultiSelect } from "react-multi-select-component";
import AttributeOptionTwo from "../../Components/attribute/AttributeOptionTwo"
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Import React FilePond
import { registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { showingTranslateValue } from "../../helpers/translate";
import CategoryServices from "../../services/CategoryServices";
import Tree from "rc-tree";
import { ToastRight } from "../../helpers/Notification/notification";
import AttributeServices from "../../services/AttributeServices";
import { Link, useParams } from "react-router-dom";
import ProductServices from "../../services/ProductServices";
import SubmitButton from "../../Components/Common/SubmitButton";
import { ToastContainer } from "react-toastify";
import classnames from "classnames";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddProducts = () => {
    document.title = "Create Product | Ship Shop";

    const { param } = useParams();
    const resetRefTwo = useRef("");
    const [imageUrl, setImageUrl] = useState([]);
    const [resizeUrl, setResizeUrl] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [defaultCategory, setDefaultCategory] = useState([]);
    const [attribue, setattribue] = useState([])
    const [attributes, setAttributes] = useState([]);
    const [totalStock, setTotalStock] = useState(0);
    const [attTitle, setAttTitle] = useState([]);
    const [variantTitle, setVariantTitle] = useState([]);
    const [variantTypes, setvariantTypes] = useState([])
    const [attriValues, setattriValues] = useState({});
    const [variant, setVariant] = useState([]);
    let [variants, setVariants] = useState([]);
    let [isVariant, setIsVariant] = useState(false);
    const [variantModalOpen, setVariantModalOpen] = useState(false);
    const [data, setData] = useState([])
    const [loading, setloading] = useState(false)
    const [tag, setTag] = useState([]);

    const [customNav, setcustomNav] = useState("1");
    const customNavtoggle = (tab) => {
        if (customNav !== tab) {
            setcustomNav(tab);
        }
    };

    const handleClose = () => {
        formik.resetForm();
        setImageUrl([])
        setSelectedCategory([])
        setDefaultCategory([])
    };

    const lang = "en"

    const STYLE = `
    .rc-tree-child-tree {
        display: hidden;
    }
    .node-motion {
        transition: all .3s;
        overflow-y: hidden;
    }
`;
    const initialValues = {
        "_id": "",
        "sku": "",
        "barcode": "",
        "title": {
            "en": ""
        },
        "description": {
            "en": ""
        },
        "shortDescription": {
            "en": ""
        },
        "type": {
            "en": ""
        },
        "brand": {
            "en": ""
        },
        "material": {
            "en": ""
        },
        "slug": "",
        "categories": [
            ""
        ],
        "category": "",
        "returnPolicy": "",
        "image": [],
        "stock": 0,
        "tag": [],
        "shippingCost": 0,
        "designcode": "0",
        "prices": {
            "price": 0,
            "shippingCost": 0,
            "originalPrice": 0,
            "discount": 0
        },
        "isCombination": false,
        "variants": []
    }

    const validationSchema = Yup.object({
        title: Yup.object({
            en: Yup.string().required("Please enter a Product Title"),
        }),
        // slug: Yup.string().required("Please Enter a slug"),
        // brand: Yup.string().required("Please Enter a brand"),
        // price: Yup.object({
        //     originalPrice: Yup.string().required("Please enter a Product Price"),
        //     price: Yup.string().required("Please enter a Product Selling Price"),
        // }),
    })

    const handleSubmit = async (values) => {
        try {
            const categories = selectedCategory.map(cat => cat._id);
            const payload = {
                title: { en: values.title.en },
                description: { en: values.description.en || "" },
                shortDescription: { en: values.shortDescription.en || "" },
                type: { en: values.type.en || "" },
                brand: { en: values.brand.en || "" },
                material: { en: values.material.en || "" },
                slug: values.slug || values.title.en.toLowerCase().replace(/\s+/g, "-"),
                categories,
                category: defaultCategory[0]?._id || categories[0],
                returnPolicy: values.returnPolicy,
                image: imageUrl, // Use uploaded image URLs
                stock: parseInt(values.stock) || 0,
                tag: values.tag,
                shippingCost: parseFloat(values.prices.shippingCost) || 0,
                designcode: values.designcode,
                prices: {
                    price: parseFloat(values.prices.price) || 0,
                    shippingCost: parseFloat(values.prices.shippingCost) || 0,
                    originalPrice: parseFloat(values.prices.originalPrice) || 0,
                    discount: parseFloat(values.prices.discount) || 0,
                },
                isCombination: isVariant,
                variants: isVariant ? variants : [],
                sku: values.sku,
                barcode: values.barcode,
            };
            if (values._id) {
                payload._id = values._id;
            }
            // Add optional variant data if exists
            if (isVariant && variants.length > 0) {
                payload.variants = variants.map(variant => ({
                    ...variant,
                    price: parseFloat(variant.price) || 0,
                    originalPrice: parseFloat(variant.originalPrice) || 0,
                    shippingCost: parseFloat(variant.shippingCost) || 0,
                    quantity: parseInt(variant.quantity) || 0,
                }));
            }

            // Handle update or create
            let response;
            if (values._id) {
                response = await ProductServices.updateProduct(payload._id, payload);
            } else {
                response = await ProductServices.addProduct(payload);
            }
            if (response.status) {
                ToastRight(response.message, "success");
                formik.resetForm();
                setSelectedCategory([]);
                setImageUrl([]);
                setVariants([]);
                setTag([])
            } else {
                ToastRight(response.message, "Failed");
            }
        } catch (error) {
            console.error("Submission error:", error);
            ToastRight(error.message || "Failed to save product", "Failed");
        } finally {
            setloading(false);
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const handleRemove = (v) => {
        setSelectedCategory(v);
    };

    const handleSelect = (key) => {
        const obj = data[0];
        const result = findObject(obj, key);

        if (result !== undefined) {
            const getCategory = selectedCategory.filter(
                (value) => value._id === result._id
            );

            if (getCategory.length !== 0) {
                return ToastRight("This category already selected!", "Failed");
            }

            setSelectedCategory((pre) => [
                ...pre,
                {
                    _id: result?._id,
                    name: showingTranslateValue(result?.name, lang),
                },
            ]);
            setDefaultCategory(() => [
                {
                    _id: result?._id,
                    name: showingTranslateValue(result?.name, lang),
                },
            ]);
        }
    };

    const renderCategories = (categories) => {
        let myCategories = [];
        for (let category of categories) {
            myCategories.push({
                title: showingTranslateValue(category?.name, lang),
                key: category._id,
                children:
                    category?.children?.length > 0 && renderCategories(category.children),
            });
        }

        return myCategories;
    };

    const motion = {
        motionName: "node-motion",
        motionAppear: false,
        onAppearStart: (node) => {
            return { height: 0 };
        },
        onAppearActive: (node) => ({ height: node.scrollHeight }),
        onLeaveStart: (node) => ({ height: node.offsetHeight }),
        onLeaveActive: () => ({ height: 0 }),
    };

    const findObject = (obj, target) => {
        return obj._id === target
            ? obj
            : obj?.children?.reduce(
                (acc, obj) => acc ?? findObject(obj, target),
                undefined
            );
    };

    const getCategorys = async () => {
        await CategoryServices.getAllCategory()
            .then((data) => {
                if (data.status) {
                    setData(data.values);
                } else {
                    ToastRight(data.message, "Failed");
                }
            })
            .catch((error) => {
                ToastRight(error.message, "Failed");
            });
    };

    const getAttributes = async () => {
        await AttributeServices.getShowingAttributes()
            .then((data) => {
                if (data.status) {
                    setattribue(data.values);
                } else {
                    ToastRight(data.message, "Failed");
                }
            })
            .catch((error) => {
                ToastRight(error.message, "Failed");
            });
    };

    useEffect(() => {
        const result = attribue?.filter((att) => att?.option !== "Checkbox").map((v) => {
            return {
                label: showingTranslateValue(v?.title, lang),
                value: showingTranslateValue(v?.title, lang),
            };
        });

        setAttTitle([...result]);

        const res = Object?.keys(Object.assign({}, ...variants));
        const varTitle = attribue?.filter((att) => res.includes(att._id));

        if (variants?.length > 0) {
            const totalStock = variants?.reduce((pre, acc) => pre + acc.quantity, 0);
            setTotalStock(Number(totalStock));
        }
        setVariantTitle(varTitle);
    }, [attribue, variants]);

    const handleAddAtt = (v) => {
        const result = attribue.filter((att) => {
            const attribueTitle = showingTranslateValue(att?.title, lang);
            return v.some((item) => item.label === attribueTitle);
        });

        const attributeArray = result.map((value) => {
            const attributeTitle = showingTranslateValue(value?.title, lang);
            return {
                ...value,
                label: attributeTitle,
                value: value._id,
            };
        });

        setvariantTypes(attributeArray.map((e) => e.label));
        setAttributes(attributeArray);
    };

    useEffect(() => {
        getCategorys();
        getAttributes()
    }, []);

    const isEqual = (obj1, obj2) => {
        const keys1 = Object.keys(obj1).sort();
        const keys2 = Object.keys(obj2).sort();

        if (keys1.length !== keys2.length) return false;

        return keys1.every(key =>
            obj1[key] === obj2[key]
        );
    };

    const handleGenerateCombination = () => {
        console.log("Varients")
        if (Object.keys(attriValues).length === 0) {
            return ToastRight("Please select variant attributes first!", "Failed");
        }

        const newVariants = generateCombinations(attriValues).map(combo => {
            return {
                options: combo,
                price: formik.values.prices.price || 0,
                originalPrice: formik.values.prices.originalPrice || 0,
                shippingCost: formik.values.prices.shippingCost || 0,
                quantity: 0,
                sku: "",
                barcode: ""
            }
        });

        setVariants(prev => [
            ...newVariants.filter(newVar =>
                !prev.some(existing =>
                    isEqual(existing.options, newVar.options)
                )
            )]);
    };

    const handleDeleteVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    }

    const generateCombinations = (attributesObj) => {
        const validAttributes = Object.entries(attributesObj)
            .filter(([key, values]) => key !== 'varianttypes' && values.length > 0)
            .reduce((acc, [key, values]) => ({ ...acc, [key]: [...new Set(values)] }), {});

        const attributeKeys = Object.keys(validAttributes);
        if (!attributeKeys.length) return [];

        const combinations = [];
        const generate = (currentCombo, index) => {
            if (index === attributeKeys.length) {
                combinations.push(currentCombo);
                return;
            }
            const key = attributeKeys[index];
            validAttributes[key].forEach(value => {
                generate({ ...currentCombo, [key]: value }, index + 1);
            });
        };
        generate({}, 0);

        return Array.from(new Map(combinations.map(combo => [JSON.stringify(combo), combo])).values());
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const handleVariantKeyDown = (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            e.preventDefault();
            const newValue = e.target.value.trim().toLowerCase();
            const existingTag = formik.values.tag.map((v) =>
                v.toLowerCase()
            );
            if (!existingTag.includes(newValue)) {
                formik.setFieldValue("tag", [
                    ...formik.values.tag,
                    e.target.value.trim(),
                ]);
            }
            e.target.value = "";
        }
    };

    const handleRemoveVariant = (index) => {
        const newVariants = formik.values.tag.filter((_, i) => i !== index);
        formik.setFieldValue("tag", newVariants);
    };

    const handleEdit = async () => {
        const data = await ProductServices.getProductById(param);
        console.log(data)
        if (data.status) {
            setIsVariant(data.values.isCombination);
            if (data.values.isCombination) {
                const variantAttributes = [...new Set(
                    data.values.variants.flatMap(v => Object.keys(v.options))
                )]
                // Correct typo: 'attribue' -> 'attributes'
                const selectedAttrs = attributes.filter(attr =>
                    variantAttributes.includes(attr._id)
                );
                setAttributes(selectedAttrs);
            }
            const categories = data.values.categories.map(cat => ({
                _id: cat._id,
                name: showingTranslateValue(cat.name, lang)
            }));

            setSelectedCategory(categories);
            setDefaultCategory([categories[0]]);
            setVariants(data.values.variants || []);
            setIsVariant(data.values.isCombination);

            const initialAttributeValues = data.values.variants?.reduce((acc, variant) => {
                Object.entries(variant.options).forEach(([attrId, optionName]) => {
                    const attribute = attributes.find(a => a._id === attrId);
                    if (attribute) {
                        // Find the option by matching the name (assuming 'en' is used)
                        const option = attribute.variants.find(v =>
                            v.name.en === optionName
                        );
                        if (option) {
                            acc[attrId] = [{
                                _id: option._id,
                                label: showingTranslateValue(option.name, lang)
                            }];
                        }
                    }
                });
                return acc;
            }, {});

            setattriValues(initialAttributeValues || {});
            formik.setValues({
                _id: data?.values?._id,
                sku: data?.values?.sku,
                barcode: data?.values?.barcode,
                title: { en: data?.values?.title.en },
                description: { en: data?.values?.description.en },
                shortDescription: { en: data?.values?.shortDescription.en },
                type: { en: data?.values?.type.en },
                brand: { en: data?.values?.brand.en },
                material: { en: data?.values?.material.en },
                slug: data?.values?.slug,
                categories: categories.map(cat => cat._id),
                category: categories[0]?._id,
                returnPolicy: data?.values?.returnPolicy.toString(),
                image: [...data?.values?.image],
                stock: data?.values?.stock,
                tag: [...data?.values?.tag],
                shippingCost: data?.values?.shippingCost,
                designcode: data?.values?.designcode,
                prices: {
                    price: data?.values?.prices.price,
                    shippingCost: data?.values?.shippingCost,
                    originalPrice: data?.values?.prices.originalPrice,
                    discount: data?.values?.prices.discount
                },
                isCombination: data?.values?.isCombination,
                variants: [...data?.values?.variants]
            })
            setImageUrl(data.values.image);
        } else {
            ToastRight(data.message, "Failed");
        }
    };

    const cleaeGeneratedValue = () => {
        setVariant([])
        setAttributes([]);
        setattriValues({});
        setVariant([])
        setVariants([])
        setvariantTypes([]);
    }

    const handleUpdateManyProducts = async () => {
        try {
            const payload = {
                _id: param,
                variants: variants.map(variant => ({
                    ...variant,
                    price: parseFloat(variant.price) || 0,
                    originalPrice: parseFloat(variant.originalPrice) || 0,
                    shippingCost: parseFloat(variant.shippingCost) || 0,
                    quantity: parseInt(variant.quantity) || 0,
                    sku: variant.sku,
                    barcode: variant.barcode,
                    image: variant.image,
                    options: variant.options
                })),
                isCombination: isVariant
            };
            const response = await ProductServices.updateManyProducts(payload);

            if (response.status) {
                ToastRight("Variants updated successfully", "Success");
                setVariantModalOpen(false);
            } else {
                ToastRight(response.message, "Failed");
            }
        } catch (error) {
            console.error("Error updating variants:", error);
            ToastRight(error.message || "Failed to update variants", "Failed");
        }
    };

    useEffect(() => {
        if (!!param) {
            handleEdit();
            getAttributes().then(() => handleEdit());
        } else {
            handleClose()
        }
    }, [param])

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Create Product" pageTitle="Ecommerce" />
                <Card>
                    <CardHeader className="align-items-center d-flex justify-content-between">
                        <Nav pills className="nav-customs nav-danger mb-3">
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customNav === "1" })} onClick={() => { customNavtoggle("1"); }} >
                                    Product
                                </NavLink>
                            </NavItem>
                            {
                                isVariant && (
                                    <NavItem>
                                        <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customNav === "2" })} onClick={() => { customNavtoggle("2"); }} >
                                            Combination
                                        </NavLink>
                                    </NavItem>
                                )
                            }
                        </Nav>
                        <div className="align-items-center d-flex justify-content-between">
                            <Link to={'/products'} className="btn btn-primary btn-label right shadow mx-2">
                                <i className=" ri-table-line label-icon align-middle rounded-pill fs-16 ms-2"></i>Products
                            </Link>
                            <Link to={'/add-product'} className="btn btn-success btn-label right shadow">
                                <i className=" ri-table-line label-icon align-middle rounded-pill fs-16 ms-2"></i> Create Product
                            </Link>
                        </div>
                    </CardHeader>
                </Card>

                <TabContent activeTab={customNav} className="text-muted">
                    <TabPane tabId="1" id="border-navs-home">
                        <div className="tab-pane active" id="border-navs-home" role="tabpanel">
                            <Row>
                                <Col lg={8}>
                                    <Card>
                                        <CardBody>
                                            <div className="mb-3">
                                                <div className="d-flex flex-grow-1 justify-content-between">
                                                    <Label className="form-label" htmlFor="product-title-input">
                                                        Product Title/Name
                                                    </Label>
                                                    {
                                                        param && (
                                                            <div className="form-check form-switch form-switch-success mb-3">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="SwitchCheck3"
                                                                >
                                                                    Product Varient
                                                                </label>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    role="switch"
                                                                    id="SwitchCheck3"
                                                                    checked={isVariant}
                                                                    onChange={(e) => {
                                                                        setIsVariant(e.target.checked);
                                                                        customNavtoggle("2")
                                                                    }}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="product-title-input"
                                                    placeholder="Enter product title"
                                                    name="title.en"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values?.title?.en}
                                                    invalid={
                                                        formik.touched.title?.en &&
                                                        !!formik.errors.title?.en
                                                    }
                                                />
                                                {formik.touched.title?.en &&
                                                    formik.errors.title?.en && (
                                                        <FormFeedback>
                                                            {formik.errors.title.en}
                                                        </FormFeedback>
                                                    )}
                                            </div>
                                            <div className="mb-3">
                                                <Label>Product Description</Label>
                                                {/* Replace textarea with CKEditor */}
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={formik.values.description?.en || ""}
                                                    onChange={(event, editor) => {
                                                        formik.setFieldValue("description.en", editor.getData());
                                                    }}
                                                    onBlur={() => formik.setFieldTouched("description.en", true)}
                                                    config={{
                                                        placeholder: "Enter product description...",
                                                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                                    }}
                                                />

                                                {formik.touched.description?.en && formik.errors.description?.en && (
                                                    <div className="invalid-feedback d-block">
                                                        {formik.errors.description.en}
                                                    </div>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Product Gallery</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col lg={6}>
                                                    <div>
                                                        <p className="text-muted">Add Product Gallery Images.</p>
                                                        <Uploader
                                                            product
                                                            folder="product"
                                                            imageUrl={imageUrl}
                                                            setImageUrl={setImageUrl}
                                                            type="product"
                                                            resizeUrl={resizeUrl}
                                                            setResizeUrl={setResizeUrl}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={6} className="d-flex justify-content-center align-items-center">
                                                    <div className="text-center">
                                                        {imageUrl?.length > 0 ? (
                                                            <img src={imageUrl[0]} alt="Uploaded Preview" className="img-fluid w-75 p-3" />
                                                        ) : (
                                                            <p className="text-muted">No image uploaded</p>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">General Info</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-Brand-input">
                                                            Product Brand
                                                        </Label>
                                                        <div className="input-group mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="product-Brand-input"
                                                                placeholder="Enter product Brand"
                                                                name="brand.en"
                                                                aria-label="Brand"
                                                                aria-describedby="product-Brand-addon"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.brand?.en}
                                                                invalid={
                                                                    formik.touched.brand?.en &&
                                                                    !!formik.errors.brand?.en
                                                                }
                                                            />
                                                            {formik.touched.brand?.en &&
                                                                formik.errors.brand?.en && (
                                                                    <FormFeedback>
                                                                        {formik.errors.brand.en}
                                                                    </FormFeedback>
                                                                )}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-Type-input">
                                                            Product Type
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="product-Type-input"
                                                            placeholder="Enter product Quantity"
                                                            name="type.en"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.type?.en}
                                                            invalid={
                                                                formik.touched.type?.en &&
                                                                !!formik.errors.type?.en
                                                            }
                                                        />
                                                        {formik.touched.type?.en &&
                                                            formik.errors.type?.en && (
                                                                <FormFeedback>
                                                                    {formik.errors.type.en}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-stock-input">
                                                            Product Quantity
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="product-stock-input"
                                                            placeholder="Enter product Quantity"
                                                            name="stock"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.stock}
                                                            invalid={
                                                                formik.touched.stock &&
                                                                !!formik.errors.stock
                                                            }
                                                        />
                                                        {formik.touched.stock &&
                                                            formik.errors.stock && (
                                                                <FormFeedback>
                                                                    {formik.errors.stock}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-originalPrice-input">
                                                            Original Price
                                                        </Label>
                                                        <div className="input-group mb-3">
                                                            <span
                                                                className="input-group-text"
                                                                id="product-originalPrice-addon"
                                                            >
                                                                $
                                                            </span>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="product-originalPrice-input"
                                                                placeholder="Enter originalPrice"
                                                                name="prices.originalPrice"
                                                                aria-label="originalPrice"
                                                                aria-describedby="product-originalPrice-addon"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values?.prices?.originalPrice}
                                                                invalid={
                                                                    formik.touched.prices?.originalPrice &&
                                                                    !!formik.errors.prices?.originalPrice
                                                                }
                                                            />
                                                            {formik.touched.prices?.originalPrice &&
                                                                formik.errors.prices?.originalPrice && (
                                                                    <FormFeedback>
                                                                        {formik.errors.prices?.originalPrice}
                                                                    </FormFeedback>
                                                                )}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-price-input">
                                                            Sale Price
                                                        </Label>
                                                        <div className="input-group mb-3">
                                                            <span
                                                                className="input-group-text"
                                                                id="product-price-addon"
                                                            >
                                                                $
                                                            </span>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="product-price-input"
                                                                placeholder="Enter product SalePrice"
                                                                name="prices.price"
                                                                aria-label="price"
                                                                aria-describedby="product-price-addon"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values?.prices?.price}
                                                                invalid={
                                                                    formik.touched.prices?.price &&
                                                                    !!formik.errors.prices?.price
                                                                }
                                                            />
                                                            {formik.touched.prices?.price &&
                                                                formik.errors.prices?.price && (
                                                                    <FormFeedback>
                                                                        {formik.errors.prices?.price}
                                                                    </FormFeedback>
                                                                )}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-shippingCost-input">
                                                            Product Shipping Cost
                                                        </Label>
                                                        <div className="input-group mb-3">
                                                            <span
                                                                className="input-group-text"
                                                                id="product-shippingCost-addon"
                                                            >
                                                                $
                                                            </span>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="product-shippingCost-input"
                                                                placeholder="Enter product shippingCost"
                                                                name="prices.shippingCost"
                                                                aria-label="shippingCost"
                                                                aria-describedby="product-shippingCost-addon"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values?.prices?.shippingCost}
                                                                invalid={
                                                                    formik.touched.prices?.shippingCost &&
                                                                    !!formik.errors.prices?.shippingCost
                                                                }
                                                            />
                                                            {formik.touched.prices?.shippingCost &&
                                                                formik.errors.prices?.shippingCost && (
                                                                    <FormFeedback>
                                                                        {formik.errors.prices?.shippingCost}
                                                                    </FormFeedback>
                                                                )}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-sku-input">
                                                            Product sku
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="product-sku-input"
                                                            placeholder="Enter product sku"
                                                            name="sku"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.sku}
                                                            invalid={
                                                                formik.touched.sku &&
                                                                !!formik.errors.sku
                                                            }
                                                        />
                                                        {formik.touched.sku &&
                                                            formik.errors.sku && (
                                                                <FormFeedback>
                                                                    {formik.errors.sku}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-slug-input">
                                                            Product slug
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="product-slug-input"
                                                            placeholder="Enter product Quantity"
                                                            name="slug"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.slug}
                                                            invalid={
                                                                formik.touched.slug &&
                                                                !!formik.errors.slug
                                                            }
                                                        />
                                                        {formik.touched.slug &&
                                                            formik.errors.slug && (
                                                                <FormFeedback>
                                                                    {formik.errors.slug}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-barcode-input">
                                                            Product barcode
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="product-barcode-input"
                                                            placeholder="Enter product barcode"
                                                            name="barcode"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.barcode}
                                                            invalid={
                                                                formik.touched.barcode &&
                                                                !!formik.errors.barcode
                                                            }
                                                        />
                                                        {formik.touched.barcode &&
                                                            formik.errors.barcode && (
                                                                <FormFeedback>
                                                                    {formik.errors.barcode}
                                                                </FormFeedback>
                                                            )}
                                                    </div>

                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-designcode-input">
                                                            Product designcode
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="product-designcode-input"
                                                            placeholder="Enter product designcode"
                                                            name="designcode"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.designcode}
                                                            invalid={
                                                                formik.touched.designcode &&
                                                                !!formik.errors.designcode
                                                            }
                                                        />
                                                        {formik.touched.designcode &&
                                                            formik.errors.designcode && (
                                                                <FormFeedback>
                                                                    {formik.errors.designcode}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>

                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-title-input">
                                                            Return Policy
                                                        </Label>
                                                        <select
                                                            name={"returnPolicy"}
                                                            className="form-select"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.returnPolicy}
                                                        >
                                                            <option value="" defaultValue hidden>Select Return Policy</option>
                                                            <option value={0}>No</option>
                                                            <option value={1}>Yes</option>
                                                        </select>
                                                        {formik.touched.returnPolicy &&
                                                            formik.errors.returnPolicy && (
                                                                <FormFeedback>
                                                                    {formik.errors.returnPolicy}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="text-end mb-3">
                                                        <SubmitButton
                                                            cancel={handleClose}
                                                            submit={formik.handleSubmit}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col lg={4}>
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Product Categories</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col lg={12}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-Category-input">
                                                            Product Category
                                                        </Label>
                                                        <Multiselectdropdown
                                                            displayValue="name"
                                                            groupBy="name"
                                                            isObject={true}
                                                            hidePlaceholder={true}
                                                            onKeyPressFn={function noRefCheck() { }}
                                                            onRemove={(v) => handleRemove(v)}
                                                            onSearch={function noRefCheck() { }}
                                                            onSelect={(v) => handleSelect(v)}
                                                            // options={selectedCategory}
                                                            selectedValues={selectedCategory}
                                                            placeholder={"Select Category"}
                                                        ></Multiselectdropdown>
                                                        {!loading && data !== undefined && (
                                                            <div className="draggable-demo capitalize">
                                                                <style dangerouslySetInnerHTML={{ __html: STYLE }} />
                                                                <Tree
                                                                    expandAction="click"
                                                                    treeData={renderCategories(data)}
                                                                    // defaultCheckedKeys={id}
                                                                    onSelect={(v) => handleSelect(v[0])}
                                                                    motion={motion}
                                                                    animation="slide-up"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col lg={12}>
                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="product-DefaultCategory-input">
                                                            Default Category
                                                        </Label>
                                                        <Multiselectdropdown
                                                            displayValue="name"
                                                            isObject={true}
                                                            singleSelect={true}
                                                            ref={resetRefTwo}
                                                            hidePlaceholder={true}
                                                            onKeyPressFn={function noRefCheck() { }}
                                                            onRemove={function noRefCheck() { }}
                                                            onSearch={function noRefCheck() { }}
                                                            onSelect={(v) => setDefaultCategory(v)}
                                                            selectedValues={defaultCategory}
                                                            options={selectedCategory}
                                                            placeholder={"Default Category"}
                                                        ></Multiselectdropdown>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Product Tags</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="hstack gap-3 align-items-start">
                                                <div className="flex-grow-1">
                                                    <Col lg={12}>
                                                        <Col md={12}>
                                                            <div className="mb-3">
                                                                <Label className="form-label">Product Tag</Label>
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Type and press Enter"
                                                                    onKeyDown={handleVariantKeyDown}
                                                                />
                                                                {formik.touched.tag &&
                                                                    formik.errors.tag && (
                                                                        <FormFeedback>
                                                                            {formik.errors.tag}
                                                                        </FormFeedback>
                                                                    )}
                                                                <div className="mt-2">
                                                                    <Row>
                                                                        {formik.values.tag.map((tag, index) => (
                                                                            <Col
                                                                                xs={12}
                                                                                md={6}
                                                                                key={index}
                                                                                className="mb-2"
                                                                            >
                                                                                <Badge className="d-flex bg-info align-items-center justify-content-between px-3 py-2 w-100">
                                                                                    <span className="text-white text-truncate">
                                                                                        {tag}
                                                                                    </span>
                                                                                    <CloseButton
                                                                                        onClick={() => handleRemoveVariant(index)}
                                                                                        className="ms-2"
                                                                                        variant="white"
                                                                                    />
                                                                                </Badge>
                                                                            </Col>
                                                                        ))}
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Col>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Product Material</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Col lg={12}>
                                                <div className="mb-3">
                                                    <div className="input-group mb-3">
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="product-Material-input"
                                                            placeholder="Enter product Material"
                                                            name="material.en"
                                                            aria-label="Material"
                                                            aria-describedby="product-Material-addon"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.material?.en}
                                                            invalid={
                                                                formik.touched.material?.en &&
                                                                !!formik.errors.material?.en
                                                            }
                                                        />
                                                        {formik.touched.material?.en &&
                                                            formik.errors.material?.en && (
                                                                <FormFeedback>
                                                                    {formik.errors.material?.en}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </div>
                                            </Col>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Product Short Description</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="mb-3">
                                                <textarea
                                                    name="shortDescription.en"
                                                    className="form-control"
                                                    id="product-shortDescription-input"
                                                    placeholder="Must enter minimum of a 100 characters"
                                                    rows="3"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.shortDescription?.en}
                                                    invalid={
                                                        formik.touched.shortDescription?.en &&
                                                        !!formik.errors.shortDescription?.en
                                                    }
                                                ></textarea>
                                                {formik.touched.shortDescription?.en &&
                                                    formik.errors.shortDescription?.en && (
                                                        <FormFeedback>
                                                            {formik.errors.shortDescription?.en}
                                                        </FormFeedback>
                                                    )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>

                    <TabPane tabId="2" id="border-navs-profile">
                        {isVariant && (
                            <Col lg={12}>
                                <Card>
                                    <CardHeader className="align-items-center d-flex justify-content-between">
                                        <div className="flex-grow-1">
                                            <h4 className="card-title mb-0">Product Variant</h4>
                                        </div>
                                        <div className="text-end mt-3">
                                            <SubmitButton
                                                cancel={cleaeGeneratedValue}
                                                submit={handleUpdateManyProducts}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="p-6">
                                            <Col lg={12}>
                                                <Row className="flex-wrap g-2 pb-2 my-2">
                                                    <Col xs={6} md={3} className="flex-shrink-0">
                                                        <div className="border p-2 rounded">
                                                            <div className="fw-medium mb-2">Select Variant</div>
                                                            <MultiSelect
                                                                options={attTitle}
                                                                value={attributes.map(attr => ({
                                                                    label: attr.label,
                                                                    value: attr.value
                                                                }))}
                                                                onChange={(v) => handleAddAtt(v)}
                                                                labelledBy="Select Attributes"
                                                            />
                                                        </div>
                                                    </Col>
                                                    {attributes?.map((attribute, i) => (
                                                        <Col xs={6} md={3} key={attribute._id}>
                                                            <div className="border p-2 rounded">
                                                                <div className="fw-medium mb-2">{attribute.label}</div>
                                                                <AttributeOptionTwo
                                                                    id={i + 1}
                                                                    values={attriValues}
                                                                    lang="en"
                                                                    attributes={attribute}
                                                                    setValues={setattriValues}
                                                                    variantTypes={variantTypes}
                                                                />
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                                <div className="text-end mb-6">
                                                    <Button
                                                        color="success"
                                                        onClick={handleGenerateCombination}
                                                        className="mx-2"
                                                    >
                                                        Generate Variants
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        onClick={cleaeGeneratedValue}
                                                        className="mx-2"
                                                    >
                                                        Clear Variants
                                                    </Button>
                                                </div>
                                                {variants.length > 0 && (
                                                    <Row>
                                                        <Col xl={12}>
                                                            <Card>
                                                                <CardBody>
                                                                    <div className="table-responsive">
                                                                        <Table className="table-bordered align-middle">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Type</th>
                                                                                    <th>Image</th>
                                                                                    <th>SKU</th>
                                                                                    <th>Barcode</th>
                                                                                    <th>Price</th>
                                                                                    <th>Original Price</th>
                                                                                    <th>Stock</th>
                                                                                    <th>Actions</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {variants.map((variant, index) => {

                                                                                    return <tr key={index}>
                                                                                        {attributes.map(attr => (
                                                                                            <td key={attr._id}>
                                                                                                {variant.options[attr._id] || ''}
                                                                                            </td>
                                                                                        ))}
                                                                                        <td>
                                                                                            <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                                                                                                <img src={avatar1}
                                                                                                    className="rounded-circle avatar-md img-thumbnail user-profile-image"
                                                                                                    alt="user-profile" />
                                                                                                <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                                                                    <Input id="profile-img-file-input" type="file"
                                                                                                        className="profile-img-file-input" />
                                                                                                    <Label htmlFor="profile-img-file-input"
                                                                                                        className="profile-photo-edit avatar-xs">
                                                                                                        <span className="avatar-title rounded-circle bg-light text-body">
                                                                                                            <i className="ri-camera-fill"></i>
                                                                                                        </span>
                                                                                                    </Label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>

                                                                                        <td>
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={variant.sku}
                                                                                                onChange={(e) =>
                                                                                                    handleVariantChange(index, 'sku', e.target.value)
                                                                                                }
                                                                                                placeholder="SKU"
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={variant.barcode}
                                                                                                onChange={(e) =>
                                                                                                    handleVariantChange(index, 'barcode', e.target.value)
                                                                                                }
                                                                                                placeholder="Barcode"
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Input
                                                                                                type="number"
                                                                                                value={variant.price}
                                                                                                onChange={(e) =>
                                                                                                    handleVariantChange(index, 'price', e.target.value)
                                                                                                }
                                                                                                step="0.01"
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Input
                                                                                                type="number"
                                                                                                value={variant.originalPrice}
                                                                                                onChange={(e) =>
                                                                                                    handleVariantChange(index, 'originalPrice', e.target.value)
                                                                                                }
                                                                                                step="0.01"
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Input
                                                                                                type="number"
                                                                                                value={variant.quantity}
                                                                                                onChange={(e) =>
                                                                                                    handleVariantChange(index, 'quantity', e.target.value)
                                                                                                }
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Button
                                                                                                color="danger"
                                                                                                onClick={() => handleDeleteVariant(index)}
                                                                                            >
                                                                                                <i className="ri-delete-bin-line"></i>
                                                                                            </Button>
                                                                                        </td>
                                                                                    </tr>
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>

                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                )}
                                            </Col>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        )}
                    </TabPane>
                </TabContent>
                <ToastContainer />
            </Container>
        </div>
    );

};

export default AddProducts;