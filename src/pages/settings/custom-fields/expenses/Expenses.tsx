/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { CustomFieldsPlanAlert } from '$app/components/CustomFieldsPlanAlert';
import { useTranslation } from 'react-i18next';
import { useTitle } from '$app/common/hooks/useTitle';
import { Settings } from '$app/components/layouts/Settings';
import { Card } from '$app/components/cards';
import { Field } from '../components/Field';
import { useHandleCustomFieldChange } from '$app/common/hooks/useHandleCustomFieldChange';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useHandleCompanySave } from '../../common/hooks/useHandleCompanySave';

export function Expenses() {
  useTitle('custom_fields');

  const [t] = useTranslation();

  const title = `${t('custom_fields')}: ${t('expenses')}`;

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('custom_fields'), href: '/settings/custom_fields' },
    { name: t('expenses'), href: '/settings/custom_fields/expenses' },
  ];

  const company = useCurrentCompany();
  const handleChange = useHandleCustomFieldChange();
  const save = useHandleCompanySave();

  return (
    <Settings
      title={t('custom_fields')}
      breadcrumbs={pages}
      docsLink="en/advanced-settings/#custom_fields"
      onSaveClick={save}
    >
      <CustomFieldsPlanAlert />

      <Card title={title}>
        {['expense1', 'expense2', 'expense3', 'expense4'].map((field) => (
          <Field
            key={field}
            field={field}
            placeholder={t('expense_field')}
            onChange={(value) => handleChange(field, value)}
            initialValue={company.custom_fields[field]}
          />
        ))}
      </Card>
    </Settings>
  );
}
