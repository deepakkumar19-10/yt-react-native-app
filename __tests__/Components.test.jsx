import React from 'react';
import AllItems from '../src/Project/AllItems';
import CreateScreen from '../src/Project/CreateScreen';
import HomeScreen from '../src/Project/HomeScreen';
import Login from '../src/Project/Login';
import Profile from '../src/Screens/Profile';
import Search from '../src/Screens/Search';
import { Colors, Spacing, Typography } from '../src/theme/theme';

describe('YtReactNative Mobile Theme & Components', () => {
  test('theme has valid colors matching web companion', () => {
    expect(Colors.primary).toBe('#7535BC');
    expect(Colors.warning).toBe('#F59E0B');
    expect(Colors.success).toBe('#10B981');
    expect(Colors.error).toBe('#EF4444');
    expect(Colors.background).toBe('#F4F3F7');
    expect(Colors.surface).toBe('#FFFFFF');
    expect(Colors.darkCanvas).toBe('#14111C');
    expect(Colors.darkSurface).toBe('#1F1A29');
  });

  test('theme typography and spacing are defined', () => {
    expect(Typography.header.fontSize).toBe(22);
    expect(Typography.title.fontSize).toBe(18);
    expect(Spacing.md).toBe(12);
    expect(Spacing.lg).toBe(16);
  });

  test('AllItems component creates valid element with restock and SKU', () => {
    const mockData = [
      {
        id: 1,
        name: 'Wheat',
        stock: 5,
        unit: 'kg',
        category: 'Grains & Cereals',
        storageBin: 'Bin A-1',
        description: 'Fresh whole wheat grains.',
      },
    ];

    const element = (
      <AllItems
        data={mockData}
        onRestock={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.data.length).toBe(1);
    expect(element.props.data[0].name).toBe('Wheat');
    expect(element.props.data[0].stock).toBe(5);
  });

  test('HomeScreen component creates valid element with logout callback', () => {
    const onLogout = jest.fn();
    const element = <HomeScreen onLogout={onLogout} />;
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.onLogout).toBe(onLogout);
  });

  test('CreateScreen component creates valid element with form props', () => {
    const setdata = jest.fn();
    const element = <CreateScreen data={[]} setdata={setdata} />;
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.setdata).toBe(setdata);
  });

  test('Search component creates valid element with search props', () => {
    const items = [{ id: 1, name: 'Rice', stock: 15 }];
    const element = <Search items={items} />;
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.items.length).toBe(1);
  });

  test('Profile component creates valid element with manager stats', () => {
    const element = (
      <Profile itemCount={6} lowStockCount={3} totalStockKg={149} />
    );
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.itemCount).toBe(6);
    expect(element.props.lowStockCount).toBe(3);
    expect(element.props.totalStockKg).toBe(149);
  });

  test('Login component creates valid element with auth callback', () => {
    const onLoginSuccess = jest.fn();
    const element = <Login onLoginSuccess={onLoginSuccess} />;
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.onLoginSuccess).toBe(onLoginSuccess);
  });
});
