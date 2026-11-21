import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { DEMO_LOCATIONS } from '../demoData';
import { PickupLocations } from './PickupLocations';

const demo: Demo = {
  title: 'PickupLocations',
  group: 'Checkout blocks',
  order: 7,
  summary: 'What the Delivery section shows for Pick up: a heading, how many stores have stock, and a choice list with each store’s address, readiness and distance.',
  usage: `<PickupLocations locations={locations} value={storeId} onChange={setStoreId} />`,
  props: [
    ['locations', 'PickupLocation[]', '{ id, name, address, ready?, distance? }'],
    ['value / onChange', 'string / (id) => void', 'The chosen store.'],
    ['name', 'string', 'Shared name of the radios. Default "pickup".'],
  ],
  Example: () => {
    const [store, setStore] = useState('flagship');
    return (
      <States>
        <State label="Two stores" width={500}>
          <PickupLocations name="demo-pickup" locations={DEMO_LOCATIONS} value={store} onChange={setStore} />
        </State>
      </States>
    );
  },
};

export default demo;
