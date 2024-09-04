<dl>
  <dt id="durability">
    <a href="#durability">#</a>
    Durability
  </dt>
  <dd>
    A system that is durable is able to perform its responsibilities over time, even when unexpected events may occur.
  </dd>
  <dt id="durableStorage">
    <a href="#durableStorage">#</a>
    Durable storage
  </dt>
  <dd>
    A durable storage system will reliably store data without data loss.
  </dd>
  <dt id="throughput">
    <a href="#throughput">#</a>
    Throughput
  </dt>
  <dd>
    Throughput measures the volume of data that passes through a network in a given period.
  </dd>
  <dt id="crossCuttingConcerns">
    <a href="#crossCuttingConcerns">#</a>
    Cross-cutting concerns
  </dt>
  <dd>
    Aspects of a program affect multiple parts of the system and can't be cleanly contained within just one module or component. These aspects often get mixed into many different areas of the code, leading to two main problems:
    <ul>
      <li>
        Scattering AKA code duplication.
      </li>
      <li>
        Tangling AKA tight coupling.
      </li>
    </ul>
    E.g. authentication, authorization, rate limiting, and general data format validation.
  </dd>
  <dt id="datum">
    <a href="#datum">#</a>
    Datum
  </dt>
  <dd>
    A single piece of information.
  </dd>
  <dt id="partialFailures">
    <a href="#partialFailures">#</a>
    Partial failures
  </dt>
  <dd>
    Some components of the system fail while others continue to function.
  </dd>
  <dt id="idempotency">
    <a href="#idempotency">#</a>
    Idempotency
  </dt>
  <dd>
    An operation can be repeated or retried as often as necessary without causing unintended effects (Learn more <a href="https://github.com/kasir-barati/nestjs-materials/tree/main/.github/docs/designing-restful-api#idempotency">here</a>).
  </dd>
</dl>
