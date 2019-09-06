import React from 'react';
import VendorWizard from 'Views/WizardPages/Vendor';
import ProductWizard from 'Views/WizardPages/Product';
import {
    Button
} from 'reactstrap';
import Loading from 'Components/Loading';

import cn from 'classnames';

export default class Portfolio extends React.Component {
    componentDidUpdate() {
        console.log("IsVendor", this.props.isVendor);

        if(!this.props.loading && !this.props.isVendor) {
            this.props.showVendorWizard();
        }
    }

    render() {
        const {
            loading,
            products
        } = this.props;
        
        return (
            <React.Fragment>
                <VendorWizard />
                <ProductWizard />
                { /* Need something better here for loader. It should probably be an overlay to block out interactions */ }
                {
                    loading &&
                    <Loading header="Initializing" message="Please wait while resources are initialized..." />
                }
                
                <div className={cn("d-flex", "flex-column", "justify-content-center", "align-items-center", "bg-dark")}>
                    <p>Product Portfolio</p>
                    {
                        products.map((p,i)=>{
                            return (
                                <Product product={p} key={i} />
                            )
                        })
                    }
                    <Button size="sm" className={cn("mt-4", "mb-3")} onClick={this.props.showProductWizard}>
                        Add Product
                    </Button>
                </div>
            </React.Fragment>
            
        )
    }
}

class Product extends React.Component {
    render() {
        const {
            product
        } = this.props;
        return (
            <div className={cn("w-100", "d-flex", "flex-column", "justify-content-center", "align-items-center", "bg-light", "text-dark")}>
                <span>Product Info</span>
                <p>{product.name}</p>
                <p>blah blah...</p>
                <hr />
            </div>
            
        )
    }
}