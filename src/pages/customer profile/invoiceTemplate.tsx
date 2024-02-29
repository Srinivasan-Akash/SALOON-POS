export default function InvoiceTemplate({ data, services, total, GST, discount }: { data: any, services: any, total: number, GST: number, discount: number }) {
  const invoiceStyle: any = {
    container: {
      padding: '1em',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '8px',
      border: '2px solid #1b1f29',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#a075fb',
      padding: '1em',
      borderRadius: '8px 8px 0 0', // Adjusted border-radius
      border: '2px solid #1b1f29',
    },
    logoContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '.5em',
      width: '250px',
    },
    logoImage: {
      width: '50px',
      aspectRatio: '1/1',
      borderRadius: '5px',
    },
    logoTitle: {
      fontSize: '1rem',
      fontWeight: '800',
      margin: 0,
    },
    logoTagline: {
      fontSize: '.8rem',
      margin: 0,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1em',
      borderRadius: '8px', // Adjusted border-radius
      overflow: 'hidden'
    },
    th: {
      border: '2px solid #1b1f29',
      padding: '0.5em',
      textAlign: 'left',
      background: '#1b1f29',
      color: '#fff',
    },
    td: {
      border: '2px solid #1b1f29',
      padding: '0.5em',
      borderRadius: '8px', // Adjusted border-radius
    },
    totalRow: {
      borderTop: '2px solid #1b1f29',
      fontWeight: 'bold',
    },
  };

  console.log(services)

  return (
    <div style={invoiceStyle.container}>
      <nav style={invoiceStyle.nav}>
        <div style={invoiceStyle.logoContent}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRENF9uv9UWIWWbExsgj7XyX58xMFAOZTzUSQ&usqp=CAU"
            style={invoiceStyle.logoImage}
            alt="Logo"
          />
          <div>
            <h2 style={invoiceStyle.logoTitle}>XYZ's Salon</h2>
            <p style={invoiceStyle.logoTagline}>Lorem ipsum, dolor sit amet consectetur.</p>
          </div>
        </div>

        <div>
          <p style={{ textAlign: 'right', fontSize: '.8rem', lineHeight: '.5' }}>#2452208563ahjshn685</p>
          <p style={{ textAlign: 'right', fontSize: '.8rem', lineHeight: '.5' }}>Printed On 20-12-2022 At 4:25am</p>
        </div>
      </nav>

      <div>
        <h3 style={{ lineHeight: '0', fontSize: '2rem', fontWeight: '800' }}>INVOICE TO:</h3>
        <h4 style={{ lineHeight: '0', fontSize: '1rem' }}>Name Of The Customer:- <span style={{ fontWeight: '200' }}>Mr/Mrs {data.name}</span></h4>
        <h4 style={{ lineHeight: '0', fontSize: '1rem' }}>Customer Phone Number:- <span style={{ fontWeight: '200' }}>91+ {data.phone}</span></h4>
        <h4 style={{ lineHeight: '0', fontSize: '1rem' }}>Customer G-Mail ID   :- <span style={{ fontWeight: '200' }}>{data.gmail}</span></h4>
        <h4 style={{ lineHeight: '0', fontSize: '1rem' }}>Invoice Number       :- <span style={{ fontWeight: '200' }}>{data.$id}</span></h4>
      </div>
      <table style={invoiceStyle.table}>
        <thead>
          <tr>
            <th style={invoiceStyle.th}>Service Name</th>
            <th style={invoiceStyle.th}>Service Cost</th>
            <th style={invoiceStyle.th}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {
            services.map((item: any, index: number) => {
              return (<tr key={index}>
                <td style={invoiceStyle.td}>{item.selectedService?.value || ""}</td>
                <td style={invoiceStyle.td}>{item.price}</td>
                <td style={invoiceStyle.td}>{item.quantity}</td>
              </tr>)
            })
          }

          
          <tr>
            <td style={invoiceStyle.td}>GST</td>
            <td style={invoiceStyle.td}>18% on flat</td>
            <td style={invoiceStyle.td}>{GST} ₹</td>
          </tr>
          <tr>
            <td style={invoiceStyle.td}></td>
            <td style={invoiceStyle.td}>Discount</td>
            <td style={invoiceStyle.td}>-{discount} ₹</td>
          </tr>
          <tr style={invoiceStyle.totalRow}>
            <td style={{ border: 'none' }}></td>
            <td style={invoiceStyle.td}>TOTAL</td>
            <td style={invoiceStyle.td}>{total} ₹</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", textAlign: "center", width: '80%' }}>Congrats !! After Discount, You Have Saved ₹{discount}/-</h1>
      </div>
    </div>
  );
}
