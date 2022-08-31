/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import toast from 'react-hot-toast';
import { Card, Element } from '@invoiceninja/cards';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { request } from 'common/helpers/request';
import { endpoint } from 'common/helpers';
import { SelectField } from '@invoiceninja/forms';

interface Props {
  entity: string;
  onSuccess: boolean;
}

interface ImportMap {
  hash: string;
  column_map: object;
  import_type: string;
  skip_header: boolean;
  mappings: Mappings;
}

interface Mappings {
  client: any;
}

export function UploadImport(props: Props) {
  const [t] = useTranslation();
  const [formData, setFormData] = useState(new FormData());
  const [mapData, setMapData] = useState<ImportMap>();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    onSubmit: () => {
      const toastId = toast.loading(t('processing'));

      request('POST', endpoint('/api/v1/preimport'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          toast.success(t('uploaded_document'), { id: toastId });

          setMapData(response.data);
          console.log(response.data);
          props.onSuccess;

          console.log(response.data.mappings.client.headers[0]);

        })
        .catch((error) => {
          console.error(error);
          toast.error(t('error_title'), { id: toastId });
        });
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {

      acceptedFiles.forEach((file) => formData.append('files[client]', file));
      
      formData.append('import_type', 'client');

      setFormData(formData);

      formik.submitForm();
    },
  });


  return (
    <>
    <Card title={t('import')}>
      <Element leftSide={t('upload')}>
        <div
          {...getRootProps()}
          className="flex flex-col md:flex-row md:items-center"
        >
          <div className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <input {...getInputProps()} />
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              {isDragActive
                ? 'drop_your_files_here'
                : t('dropzone_default_message')}
            </span>
          </div>
        </div>
      </Element>
    </Card>

    <Card title={t('')} className="mt-10">  
      {mapData && (
        <div>
          <table className="table-auto py-3">
            <thead>
              <tr>
                <th className='text-right'>Headers</th>
                <th></th>
                <th className='py-3 px-6'>Invoice Ninja Column</th>
              </tr>
            </thead>
            <tbody>
            {mapData.mappings.client.headers[0].map((mapping:any, index:number) => (
                
                <tr className='border-t-[1px] border-gray-300 py-3' id="{index}">
                  <td className='py-2 px-2 text-right'>{mapping}</td>
                  <td><span className="text-gray-400">{mapData.mappings.client.headers[1][index].substring(0,20)}</span></td>
                  <td className='mx-4 px-4 py-3'>
                    <SelectField withBlank>
                      {mapData.mappings.client.headers[0].map((mapping: any, index: number) => (
                        <option key={index} value={index}>
                          {mapping}
                        </option>
                      ))}
                    </SelectField>
                  </td>
                </tr>
          
            ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>

    </>
  );
}
