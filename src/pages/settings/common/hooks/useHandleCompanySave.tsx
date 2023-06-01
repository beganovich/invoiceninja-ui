/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { updateRecord } from '$app/common/stores/slices/company-users';
import { useDispatch } from 'react-redux';
import { request } from '$app/common/helpers/request';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useQueryClient } from 'react-query';
import { toast } from '$app/common/helpers/toast/toast';
import { useAtom, useSetAtom } from 'jotai';
import { companySettingsErrorsAtom } from '../atoms';
import { updatingRecords as updatingRecordsAtom } from '$app/pages/settings/invoice-design/common/atoms';
import { useInjectCompanyChanges } from '$app/common/hooks/useInjectCompanyChanges';
import { useHandleUpdate } from '../../group-settings/common/hooks/useHandleUpdate';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';

export function useHandleCompanySave() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const companyChanges = useInjectCompanyChanges();
  const { isGroupLevelActive, isCompanyLevelActive } =
    useCurrentSettingsLevel();

  const handleUpdateGroupSettings = useHandleUpdate({});

  const setErrors = useSetAtom(companySettingsErrorsAtom);

  const [updatingRecords, setUpdatingRecords] = useAtom(updatingRecordsAtom);

  return () => {
    toast.processing();

    setErrors(undefined);

    if (isGroupLevelActive) {
      handleUpdateGroupSettings();
    }

    if (isCompanyLevelActive) {
      request(
        'PUT',
        endpoint('/api/v1/companies/:id', { id: companyChanges?.id }),
        companyChanges
      )
        .then((response) => {
          dispatch(
            updateRecord({ object: 'company', data: response.data.data })
          );

          queryClient.invalidateQueries('/api/v1/statics');

          toast.dismiss();

          updatingRecords?.forEach((record) => {
            toast.processing();

            if (record.checked) {
              request('POST', endpoint('/api/v1/designs/set/default'), {
                design_id: record.design_id,
                entity: record.entity,
              }).catch((error) => {
                console.log(error);
                toast.error();
              });
            }
          });

          toast.success('updated_settings');
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            setErrors(error.response.data);
            toast.dismiss();
          } else {
            console.error(error);
            toast.error();
          }
        })
        .finally(() => setUpdatingRecords(undefined));
    }
  };
}
