/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Company } from '$app/common/interfaces/company.interface';
import { injectInChanges } from '$app/common/stores/slices/company-users';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useCompanyChanges } from './useCompanyChanges';
import { useCurrentCompany } from './useCurrentCompany';
import { useCurrentSettingsLevel } from './useCurrentSettingsLevel';

export function useInjectCompanyChanges(): Company | undefined {
  const company = useCurrentCompany();
  const companyChanges = useCompanyChanges();
  const dispatch = useDispatch();
  const { isCompanyLevelActive } = useCurrentSettingsLevel();

  useEffect(() => {
    if (isCompanyLevelActive) {
      dispatch(injectInChanges({ object: 'company', data: company }));
    }
  }, [company]);

  return companyChanges;
}
