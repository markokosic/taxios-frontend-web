import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { ADD_CUSTOMER_FORM_CONFIG } from '../../../../../_ARCHIVE/customers/config/customers-form-config';
import { CustomerType } from '../../../../../_ARCHIVE/customers/types/customers-types';
import { FormFieldRenderer } from '../FormRenderer';

describe('FormRenderer', () => {
  it('renders groups and fields according to config', () => {
    const { Wrapper } = createTestAppWrapper();

    const addCustomerFields = ADD_CUSTOMER_FORM_CONFIG[CustomerType.CONSUMER].getFields();

    const Renderer = () => {
      const methods = useForm();

      return (
        <Wrapper>
          <FormProvider {...methods}>
            <FormFieldRenderer formFields={addCustomerFields} />
          </FormProvider>
        </Wrapper>
      );
    };

    render(<Renderer />);

    addCustomerFields.forEach((group) => {
      if (group.groupName) {
        expect(screen.getByText(group.groupName)).toBeInTheDocument();
      }
      group.fields.forEach((field: any) => {
        expect(screen.getByLabelText(field.labelKey)).toBeInTheDocument();
      });
    });
  });
});
