import type { ReactNode } from 'react';
import type { Demo } from '../src/demo';
import { slug } from './slug';

export function PageHead({ title, lead }: { title: string; lead: ReactNode }) {
  return (
    <header className="site-head">
      <h1>{title}</h1>
      <p>{lead}</p>
    </header>
  );
}

export function Entry({ title, summary, usage, props, children }: { title: string; summary: ReactNode; usage?: string; props?: Demo['props']; children: ReactNode }) {
  return (
    <section className="site-entry" id={slug(title)}>
      <h2>{title}</h2>
      <p className="site-summary">{summary}</p>
      <div className="site-canvas">{children}</div>
      {usage && (
        <pre className="site-code" tabIndex={0}>
          <code>{usage}</code>
        </pre>
      )}
      {props && props.length > 0 && (
        <div className="site-table-wrap">
          <table className="site-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              {props.map(([name, type, description]) => (
                <tr key={name}>
                  <td><code>{name}</code></td>
                  <td><code>{type}</code></td>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** Text with `code` spans marked by backticks. */
export function Prose({ children }: { children: string }) {
  return (
    <>
      {children.split('`').map((part, index) => (index % 2 ? <code key={index}>{part}</code> : part))}
    </>
  );
}

export function Gallery({ title, lead, demos }: { title: string; lead: string; demos: Demo[] }) {
  return (
    <>
      <PageHead title={title} lead={lead} />
      {demos.map(demo => (
        <Entry key={demo.title} title={demo.title} summary={<Prose>{demo.summary}</Prose>} usage={demo.usage} props={demo.props}>
          <demo.Example />
        </Entry>
      ))}
    </>
  );
}
