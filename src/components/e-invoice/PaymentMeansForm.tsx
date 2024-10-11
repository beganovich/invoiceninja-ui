/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { EInvoiceType } from '$app/pages/settings';
import { useTranslation } from 'react-i18next';
import { Element } from '../cards';
import { InputField } from '../forms';
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useState,
} from 'react';
import { Invoice } from '$app/common/interfaces/invoice';
import { cloneDeep, set } from 'lodash';
import { toast } from '$app/common/helpers/toast/toast';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';

type Entity = 'company' | 'invoice' | 'client';

interface Props {
  entity: Entity;
  currentEInvoice: EInvoiceType;
  isInvoiceLevel?: boolean;
  invoice?: Invoice | undefined;
  setInvoice?: Dispatch<SetStateAction<Invoice | undefined>>;
}

interface PaymentMeansFormComponent {
  saveEInvoice: () => void;
}

interface FormDetails {
  entity: Entity;
  payment_means: {
    code: string;
    iban: string;
    bic: string;
  };
}

export const PaymentMeansForm = forwardRef<PaymentMeansFormComponent, Props>(
  (props, ref) => {
    const [t] = useTranslation();

    const { currentEInvoice, isInvoiceLevel, setInvoice, invoice } = props;

    const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
    const [formDetails, setFormDetails] = useState<FormDetails>({
      entity: props.entity,
      payment_means: { code: '', iban: '', bic: '' },
    });

    const onChange = (value: string, property: string) => {
      const updatedPaymentMeansForm = cloneDeep(formDetails) as FormDetails;
      set(updatedPaymentMeansForm, property, value);
      setFormDetails(updatedPaymentMeansForm);
    };

    const handleSave = () => {
      if (!isFormBusy) {
        toast.processing();
        setIsFormBusy(true);

        request(
          'POST',
          endpoint('/api/v1/einvoice/configurations'),
          formDetails
        )
          .then(() => {
            toast.success('saved_einvoice_details');
          })
          .finally(() => setIsFormBusy(false));
      }
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          saveEInvoice() {
            handleSave();
          },
        };
      },
      [formDetails]
    );

    return (
      <div>
        <Element leftSide="Code">
          <InputField
            value={formDetails.payment_means.code || ''}
            onValueChange={(value) => onChange(value, 'payment_means.code')}
          />
        </Element>

        <Element leftSide="IBAN">
          <InputField
            value={formDetails.payment_means.iban || ''}
            onValueChange={(value) => onChange(value, 'payment_means.iban')}
          />
        </Element>

        <Element leftSide="BIC">
          <InputField
            value={formDetails.payment_means.bic || ''}
            onValueChange={(value) => onChange(value, 'payment_means.bic')}
          />
        </Element>
      </div>
    );
  }
);
