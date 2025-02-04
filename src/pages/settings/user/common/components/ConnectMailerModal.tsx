/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { Modal } from '$app/components/Modal';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connectMailerAtom } from '../../components';
import { Button } from '$app/components/forms';
import { toast } from '$app/common/helpers/toast/toast';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { useDispatch } from 'react-redux';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { updateRecord } from '$app/common/stores/slices/company-users';

export function ConnectMailerModal() {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const user = useCurrentUser();
  const company = useCurrentCompany();

  const [isMailerConnected, setIsMailerConnected] = useAtom(connectMailerAtom);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleOnClose = () => {
    setIsModalVisible(false);
    setIsMailerConnected('false');
  };

  const handleUpdateCompany = () => {
    const isGoogleProvider = user?.oauth_provider_id === 'google';

    toast.processing();

    request('PUT', endpoint('/api/v1/companies/:id', { id: company?.id }), {
      ...company,
      settings: {
        ...company.settings,
        email_sending_method: isGoogleProvider ? 'gmail' : 'office365',
        gmail_sending_user_id: user?.id,
      },
    }).then((response) => {
      dispatch(updateRecord({ object: 'company', data: response.data.data }));

      toast.success('updated_settings');

      handleOnClose();
    });
  };

  useEffect(() => {
    if (user && Object.entries(user).length) {
      if (
        (user.oauth_provider_id === 'microsoft' ||
          user.oauth_provider_id === 'google') &&
        user.oauth_user_token &&
        isMailerConnected === 'true'
      ) {
        setIsModalVisible(true);
      }
    }
  }, [user]);

  return (
    <Modal
      title={t('email_provider')}
      visible={isModalVisible}
      onClose={handleOnClose}
    >
      <span className="text-base font-medium">
        Gmail now connected, would like you to select this account to send from?
      </span>

      <div className="flex justify-between">
        <Button behavior="button" type="secondary" onClick={handleOnClose}>
          {t('no')}
        </Button>

        <Button behavior="button" type="primary" onClick={handleUpdateCompany}>
          {t('yes')}
        </Button>
      </div>
    </Modal>
  );
}
