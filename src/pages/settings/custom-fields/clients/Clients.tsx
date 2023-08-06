/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { useTitle } from '$app/common/hooks/useTitle';
import { Card } from '$app/components/cards';
import { Field } from '../components/Field';
import { useHandleCustomFieldChange } from '$app/common/hooks/useHandleCustomFieldChange';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';

export function Clients() {
  useTitle('custom_fields');

  const [t] = useTranslation();

  const title = `${t('custom_fields')}: ${t('clients')}`;
  const company = useCompanyChanges();
  const handleChange = useHandleCustomFieldChange();

  if (!company) {
    return null;
  }

  return (
    <>
      <Card title={title}>
        {['client1', 'client2', 'client3', 'client4'].map((field) => (
          <Field
            key={field}
            field={field}
            placeholder={t('client_field')}
            onChange={(value) => handleChange(field, value)}
            initialValue={company.custom_fields[field]}
          />
        ))}
      </Card>

      <Card title={`${t('custom_fields')}: ${t('contacts')}`}>
        {['contact1', 'contact2', 'contact3', 'contact4'].map((field) => (
          <Field
            key={field}
            field={field}
            placeholder={t('contact_field')}
            onChange={(value) => handleChange(field, value)}
            initialValue={company.custom_fields[field]}
          />
        ))}
      </Card>
    </>
  );
}
