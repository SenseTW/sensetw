import * as React from 'react';
import { Header } from 'semantic-ui-react';

interface Props {
}

export default function TermsOfServicePage(props: Props) {
  return (
    <div>
        <Header as="h1">使用條款</Header>
        <p>
        開放文化基金會為了讓您能夠安心使用本網站的各項服務與資訊，特此向您說明本網站的隱私權保護政策，以保障您的權益，請您詳閱下列內容：
        </p>
        <Header as="h1">使用者註冊</Header>
        你必須擔保並同意： 
        <ol>
            <li>(a) 在會員註冊表格內填入正確的、完整的、及目前的個人資料。 </li>
            <li>(b) 你所提供的電子郵件地址(E-MAIL ADDRESS)是你自己目前使用的正確電子郵件地址。
                     若該電子郵件地址有任何變更時，請進行更新，以免影響您的權益。
                     若你所提供之個人資料有填寫不實，或原所登錄之資料已不正確而遲未更新，
                     若因此造成你的任何損害，開放文化基金會及它的負責人、經理人、職員、擁有人、代理人、繼承人或維護人員將不負擔任何責任。
                     若你忘記你的密碼(Password) 或使用者代號 (user ID) ，請和我們聯繫。
            </li>
        </ol>
        <Header>帳號及密碼之保管義務</Header>
        <p>
        你對你在本網站的帳號及密碼有絕對之保管義務，請勿將帳號與密碼洩漏或提供第三人知悉或使用。若你的帳號或密碼遭人非法使用，
        開放文化基金會及它的負責人、經理人、職員、擁有人、代理人、繼承人或維護人員將不負任何賠償責任。
        一旦你發現帳號有任何異常或使用安全受破壞之情形時，應立即通知我們；因未即時通知致無法有效防止或修復時，你應自行負責所有可能所生之責任。
        </p>
        <Header as="h2">隱私權保護政策的適用範圍</Header>
        <p>
        隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。
        </p>
        <Header as="h2">個人資料的蒐集、處理及利用方式</Header>
        <p>
        當您造訪本網站或使用本網站所提供之功能服務時，我們將視該服務功能性質，請您提供必要的個人資料，並在該特定目的範圍內處理及利用您的個人資料；
        非經您書面同意，本網站不會將個人資料用於其他用途。
        </p>
        <p> 
        伺服器會自行記錄相關行徑，包括您使用連線設備的IP位址、使用時間、使用的瀏覽器、瀏覽及點選資料記錄等，做為我們增進網站服務的參考依據，此記錄為內部應用，決不對外公佈。
        為提供精確的服務，我們會將收集的容進行統計與分析，分析結果之統計數據或說明文字呈現，除供內部研究外，我們會視需要公佈統計數據及說明文字，但不涉及特定個人之資料。
        </p>
        <Header as="h2">資料之保護</Header>
        <p>
        本網站採用 HTTPS (Hypertext Transfer Protocol Secure) 傳輸安全協定，利用SSL / TLS來加密封包，保護交換資料的隱私與完整性。
        </p>
        <Header as="h2">網站對外的相關連結</Header>
        <p>
        本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結，點選進入其他網站。但該連結網站不適用本網站的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。
        </p>
        <Header as="h2">與第三人共用個人資料之政策</Header>
        <p>
        本網站絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體、私人企業或公務機關，但有法律依據或合約義務者，不在此限。
        前項但書之情形包括不限於：
            <ol>
                <li>經由您書面同意。</li>
                <li>法律明文規定。</li>
                <li>為免除您生命、身體、自由或財產上之危險。</li>
                <li>與公務機關或學術研究機構合作，基於公共利益為統計或學術研究而有必要，且資料經過提供者處理或蒐集著依其揭露方式無從識別特定之當事人。</li>
                <li>當您在網站的行為，違反服務條款或可能損害或妨礙網站與其他使用者權益或導致任何人遭受損害時，經網站管理單位研析揭露您的個人資料是為了辨識、聯絡或採取法律行動所必要者。</li>
                <li>有利於您的權益。</li>
            </ol>
        </p>
        <Header as="h2">Cookie 之使用</Header>
        <p>
        為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的 Cookie，
        若您不願接受 Cookie 的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，
        即可拒絕 Cookie 的寫入，但可能會導至網站某些功能無法正常執行 。
        </p>
        <Header as="h2">隱私權保護政策之修正</Header>
        <p>
        本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上。
        </p>
        <Header as="h2">法源依據</Header>
        <p>
        本網站所搜集之個人資料，使用者可依照台灣的個人資料保護法以及歐盟的 GDPR (General Data Protection Regulation) 相關規定進行個人資料的查詢、
        修正、請求停止利用或刪除，如您有任何需求或疑問，請聯絡我們的電子郵件：hi@ocf.tw。
        </p>
        <Header as="h2">免責條款</Header>
        <p>
            本網站原則上不對其所提供的內容或資訊做實質審查或修改，亦不擔保該內容之正確性或適法性。您若認為該網頁內含有不適當的內容，煩請逕向內容或資
            訊提供者反應意見。
            
            本網站也不對網友所提供任何可供下載的軟體、內容、資訊或任何本網站上的消息、觀點、意見、建議、價格與交易資訊負任何的責任。
            若本網站的服務或資訊，在任何情形下對使用者造成財產的、身體的、心理的、名譽的、法律的或其他的損失或傷害，開放文化基金會及它的負責人、經理人
            、職員、擁有人、代理人、繼承人或維護人員，均不必負任何責任。

            開放文化基金會與其他公司、網站或個人進行合作、策略聯盟、聯名網站、委託經營頻道或任何類似之網站策略合作計畫時，若因該第三人之行為造成您的任何損害，您同意開放文化基金會不用負擔任何責任。但本基金會承諾將盡全力協助
            您與該第三人處理相關爭議問題。本基金會也不對任何經由本網站連結出去的網站、資料庫、電子佈告欄、ＦＴＰ、或任何網路上的節點內所提供的消息、建議、意見、觀點、或任何資訊負責。
            開放文化基金會不對任何直接或間接連接到本網站的電腦、通訊設備、網路、或任何軟硬體及資料的損害、遺失、及故障負任何的責任。
        </p>
    </div>
  );
}