import { useEffect, useState } from 'react';
import type { Demo } from '../src/demo';
import { Theme } from '../src';
import { CheckoutDemo } from './CheckoutDemo';
import { Foundations, FOUNDATION_SECTIONS } from './Foundations';
import { Gallery } from './Gallery';
import { RECIPES, Recipes } from './Recipes';
import { slug } from './slug';

const modules = import.meta.glob<{ default: Demo }>('../src/**/*.demo.tsx', { eager: true });
const demos = Object.values(modules).map(module => module.default).sort((a, b) => a.order - b.order);
const components = demos.filter(demo => demo.group === 'Components');
const blocks = demos.filter(demo => demo.group === 'Checkout blocks');

function useRoute() {
  const read = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => setRoute(read());
    addEventListener('hashchange', onChange);
    return () => removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

const NAV: { id: string; title: string; items: string[] }[] = [
  { id: 'foundations', title: 'Foundations', items: FOUNDATION_SECTIONS },
  { id: 'components', title: 'Components', items: components.map(demo => demo.title) },
  { id: 'blocks', title: 'Checkout blocks', items: blocks.map(demo => demo.title) },
  { id: 'recipes', title: 'Recipes', items: RECIPES.map(recipe => recipe.title) },
];

export function App() {
  const [section, entry] = useRoute();

  // Moving between entries of a section scrolls to the entry; changing section starts at the top.
  useEffect(() => {
    if (!section) return;
    const target = entry ? document.getElementById(entry) : null;
    if (target) target.scrollIntoView({ block: 'start' });
    else scrollTo(0, 0);
  }, [section, entry]);

  useEffect(() => {
    if (section) document.title = 'Components – React Shopify-style checkout';
    else document.title = 'Checkout – Northfield Goods';
  }, [section]);

  if (!section) return <CheckoutDemo />;

  return (
    <Theme className="site">
      <nav className="site-nav" aria-label="Sections">
        <a className="site-brand" href="#/">
          <span>React Shopify-style checkout</span>
        </a>
        <a className="site-nav-top" href="#/">Full checkout →</a>
        {NAV.map(group => (
          <div key={group.id} className="site-nav-group">
            <a className="site-nav-title" href={`#/${group.id}`} aria-current={section === group.id && !entry ? 'page' : undefined}>
              {group.title}
            </a>
            {section === group.id &&
              group.items.map(item => (
                <a key={item} className="site-nav-item" href={`#/${group.id}/${slug(item)}`} aria-current={entry === slug(item) ? 'page' : undefined}>
                  {item}
                </a>
              ))}
          </div>
        ))}
      </nav>
      <main className="site-main">
        {section === 'foundations' && <Foundations />}
        {section === 'components' && (
          <Gallery title="Components" lead="Building blocks that work anywhere. Each lives in its own folder under src/primitives with its own stylesheet, and needs only a Theme above it." demos={components} />
        )}
        {section === 'blocks' && (
          <Gallery title="Checkout blocks" lead="Larger pieces of a checkout, each usable without the rest. They live under src/checkout, take their data as props, and read wording and currency from CheckoutProvider." demos={blocks} />
        )}
        {section === 'recipes' && <Recipes />}
      </main>
    </Theme>
  );
}
