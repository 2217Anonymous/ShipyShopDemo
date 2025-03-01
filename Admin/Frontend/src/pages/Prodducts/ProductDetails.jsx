import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Tooltip,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  CardHeader,
} from "reactstrap";
import DOMPurify from 'dompurify';
import SimpleBar from "simplebar-react";
import { Swiper, SwiperSlide } from "swiper/react";
import classnames from "classnames";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import ProductServices from "../../services/ProductServices";

SwiperCore.use([FreeMode, Navigation, Thumbs]);

const PricingWidgetList = (props) => {
  return (
    <React.Fragment>
      <Col lg={3} sm={6}>
        <div className="p-2 border border-dashed rounded">
          <div className="d-flex align-items-center">
            <div className="avatar-sm me-2">
              <div className="avatar-title rounded bg-transparent text-success fs-24">
                <i className={props.pricingDetails.icon}></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <p className="text-muted mb-1">{props.pricingDetails.label}:</p>
              <h5 className="mb-0">{props.pricingDetails.labelDetail}</h5>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

const DisplayContent = ({ apiResponse }) => {
  const sanitizedHTML = DOMPurify.sanitize(apiResponse);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

function ProductDetails() {
  const { param } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [productDetails, setProductDetails] = useState(null);
  const [ttop, setTtop] = useState(false);
  const [sizeTooltips, setSizeTooltips] = useState({});
  const [colorTooltips, setColorTooltips] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const getProductDetails = async (id) => {
    try {
      const response = await ProductServices.getProductById(id);
      if (response.status) {
        setProductDetails(response.values);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (param) getProductDetails(param);
  }, [param]);

  if (!productDetails) return <div>Loading...</div>;

  const sizeQuantities = {};
  const colorQuantities = {};

  productDetails.variants.forEach(variant => {
    const options = Object.values(variant.options);
    const color = options[0];
    const size = options[1];

    if (size) sizeQuantities[size] = (sizeQuantities[size] || 0) + variant.quantity;
    if (color) colorQuantities[color] = (colorQuantities[color] || 0) + variant.quantity;
  });

  const pricingWidgets = [
    { id: 1, icon: "ri-money-dollar-circle-fill", label: "Price", labelDetail: `$${productDetails.prices.price}` },
    { id: 2, icon: "ri-archive-fill", label: "Stock", labelDetail: productDetails.stock },
    { id: 3, icon: "ri-barcode-fill", label: "SKU", labelDetail: productDetails.sku },
    { id: 4, icon: "ri-truck-fill", label: "Shipping Cost", labelDetail: `$${productDetails.shippingCost}` },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Product Details" pageTitle="Ecommerce" />
        
        <Card>
          <CardHeader className="align-items-center d-flex justify-content-between">
            <div className="flex-grow-1">
              <h4 className="card-title mb-0">Products</h4>
            </div>
            <div className="align-items-center d-flex justify-content-between">
              <Link to="/products" className="btn btn-primary btn-label right shadow mx-2">
                <i className="ri-table-line label-icon align-middle rounded-pill fs-16 ms-2"></i>Products
              </Link>
              <Link to="/add-product" className="btn btn-success btn-label right shadow">
                <i className="ri-table-line label-icon align-middle rounded-pill fs-16 ms-2"></i> Create Product
              </Link>
            </div>
          </CardHeader>
        </Card>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row className="gx-lg-5">
                  <Col xl={4} md={8} className="mx-auto">
                    <div className="product-img-slider sticky-side-div">
                      <Swiper
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="swiper product-thumbnail-slider p-2 rounded bg-light"
                      >
                        {productDetails.image.map((img, index) => (
                          <SwiperSlide key={index}>
                            <img src={img} alt="" className="img-fluid d-block" />
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      <div className="product-nav-slider mt-2">
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          spaceBetween={10}
                          className="swiper product-nav-slider mt-2 overflow-hidden"
                        >
                          {productDetails.image.map((img, index) => (
                            <SwiperSlide key={index} className="rounded">
                              <div className="nav-slide-item">
                                <img src={img} alt="" className="img-fluid d-block rounded" />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </Col>

                  <Col xl={8}>
                    <div className="mt-xl-0 mt-5">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h4>{productDetails.title.en}</h4>
                          <div className="hstack gap-3 flex-wrap">
                            <div>
                              <Link to="#" className="text-primary d-block">
                                {productDetails.brand.en}
                              </Link>
                            </div>
                            <div className="vr"></div>
                            <div className="text-muted">
                              Seller : <span className="text-body fw-medium">{productDetails.insertByName}</span>
                            </div>
                            <div className="vr"></div>
                            <div className="text-muted">
                              Published : <span className="text-body fw-medium">
                                {new Date(productDetails.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Tooltip placement="top" isOpen={ttop} target="TooltipTop" toggle={() => setTtop(!ttop)}>
                            Edit
                          </Tooltip>
                          <Link to={`/product/${param}`} id="TooltipTop" className="btn btn-light">
                            <i className="ri-pencil-fill align-bottom"></i>
                          </Link>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                        <div className="text-muted fs-16">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="mdi mdi-star text-warning"></span>
                          ))}
                        </div>
                        <div className="text-muted">( {productDetails.ratings.toFixed(2)} Customer Review )</div>
                      </div>

                      <Row className="mt-4">
                        {pricingWidgets.map((pricingDetails) => (
                          <PricingWidgetList key={pricingDetails.id} pricingDetails={pricingDetails} />
                        ))}
                      </Row>

                      <Row>
                        <Col xl={6}>
                          <div className="mt-4">
                            <h5 className="fs-15">Sizes:</h5>
                            <div className="d-flex flex-wrap gap-2">
                              {Object.entries(sizeQuantities).map(([size, quantity]) => {
                                const tooltipId = `tooltip-size-${size}`;
                                return (
                                  <React.Fragment key={size}>
                                    <Input
                                      type="radio"
                                      className="btn-check"
                                      name="product-size-radio"
                                      id={tooltipId}
                                      disabled={quantity === 0}
                                      onChange={() => setSelectedSize(size)}
                                    />
                                    <Label
                                      className="btn btn-soft-primary avatar-xs rounded-circle p-0 d-flex justify-content-center align-items-center"
                                      htmlFor={tooltipId}
                                    >
                                      {size}
                                    </Label>
                                    <Tooltip
                                      isOpen={sizeTooltips[size]}
                                      target={tooltipId}
                                      toggle={() => setSizeTooltips(prev => ({ ...prev, [size]: !prev[size] }))}
                                    >
                                      {quantity === 0 ? 'Out of Stock' : `${quantity} Items Available`}
                                    </Tooltip>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>
                        </Col>

                        <Col xl={6}>
                          <div className="mt-4">
                            <h5 className="fs-15">Colors:</h5>
                            <div className="d-flex flex-wrap gap-2">
                              {Object.entries(colorQuantities).map(([color, quantity]) => {
                                const tooltipId = `tooltip-color-${color}`;
                                return (
                                  <React.Fragment key={color}>
                                    <Input
                                      type="radio"
                                      className="btn-check"
                                      name="product-color-radio"
                                      id={tooltipId}
                                      disabled={quantity === 0}
                                      onChange={() => setSelectedColor(color)}
                                    />
                                    <Label
                                      className="btn avatar-xs p-0 d-flex align-items-center justify-content-center border rounded-circle fs-20 text-danger"
                                      htmlFor={tooltipId}
                                    >
                                      <i className="ri-checkbox-blank-circle-fill"></i>
                                    </Label>
                                    <Tooltip
                                      isOpen={colorTooltips[color]}
                                      target={tooltipId}
                                      toggle={() => setColorTooltips(prev => ({ ...prev, [color]: !prev[color] }))}
                                    >
                                      {quantity === 0 ? 'Out of Stock' : `${quantity} Items Available`}
                                    </Tooltip>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm={6}>
                          <div className="mt-3">
                            <h5 className="fs-15">Features:</h5>
                            <ul className="list-unstyled">
                              {productDetails.tag.map((tag, index) => (
                                <li key={index} className="py-1">
                                  <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mt-3">
                            <h5 className="fs-15">Services:</h5>
                            <ul className="list-unstyled product-desc-list">
                              {productDetails.returnPolicy === 1 && <li>10 Days Replacement</li>}
                              <li>Cash on Delivery available</li>
                            </ul>
                          </div>
                        </Col>
                      </Row>

                      <div className="product-content mt-5">
                        <Nav tabs className="nav-tabs-custom nav-success">
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({ active: customActiveTab === "1" })}
                              onClick={() => toggleCustom("1")}
                            >
                              Specification
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({ active: customActiveTab === "2" })}
                              onClick={() => toggleCustom("2")}
                            >
                              Details
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent activeTab={customActiveTab} className="border border-top-0 p-4">
                          <TabPane tabId="1">
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row" style={{ width: "200px" }}>Category</th>
                                    <td>{productDetails.category.name.en}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Brand</th>
                                    <td>{productDetails.brand.en}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Color</th>
                                    <td>{Object.keys(colorQuantities)[0] || 'N/A'}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Material</th>
                                    <td>{productDetails.material.en}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </TabPane>
                          <TabPane tabId="2">
                            <div>
                              <h5 className="mb-3">{productDetails.title.en}</h5>
                              <p>{productDetails.shortDescription.en}</p>
                              <div>
                                <p className="mb-2">
                                  <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>
                                  Material: {productDetails.material.en}
                                </p>
                                <p className="mb-0">
                                  <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>
                                  Created At: {new Date(productDetails.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductDetails;