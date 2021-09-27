<template>
  <div id="organization">
    <template v-if="locale==='de'">
      <h1>Suchhilfe</h1>
      <p>Die Suche auf entscheidsuche.ch ist eine Volltextsuche, die mit Metadaten ergänzt werden kann. Im Suchfeld können Sie beliebige Suchbegriffe eingeben. Die Klein- und
         Grossschreibung spielt dabei keine Rolle.
      </p>
      <h2>Textsuche</h2>
      <h3>Trunkierung</h3>
      <p>Suchen Sie z.B. mit <i>Eigentümer</i>, so erhalten Sie nur Dokumente, in denen der Begriff so vorkommt. Dokumente, in denen <i>Eigentümerin</i> oder
         <i>Eigentümers</i> enthalten sind, werden nicht gefunden. Mit <i>Eigentümer*</i> werden jedoch alle Wörter gefunden, die so beginnen. Sie können dabei auch
         Linkstrunkieren, d.h. <i>*Eigentümer</i> findet auch Begriffe, wie z.B. <i>Grundeigentümer</i>. Auch eine kombiniert Links- und Rechtstrunkierung ist möglich:
         <i>*Eigentümer*</i>. Sie findet z.B. auch die <i>Grundeigentümerin</i>. Auch können einzelne Buchstaben durch einen Platzhalter ersetzt werden. So findet <i>?udex</i>
         sowohl <i>judex</i> als auch <i>iudex</i>.
      </p>
      <h3>Fuzzy-Suche</h3>
      <p>Begriffe können auch in ähnlicher Schreibweise gesucht werden. Dazu wird eine angefügte Tilde (<i>~</i>) verwendet. Dabei wird eine <a href="https://de.wikipedia.org/wiki/Levenshtein-Distanz">Levenshtein-Distanz</a>
         von 2 verwendet. So findet <i>Eigentümer~</i> auch <i>Eigentümerin</i>. Schwächere oder stärkere Abweichungen können mit <i>Eigentümer~1</i> oder <i>Eigentümer~3</i> gefunden werden.
         Die Fuzzy-Suche kann in einem Suchbegriff nicht mit der Trunkierung kombiniert werden.
      </p>
      <h3>Logische Verknüpfung</h3>
      <p>Wenn Sie mit zwei Suchbegriffen suchen, werden diese automatisch mit <i>AND</i> verknüpft. Das bedeutet, dass beide Begriffe gleichzeitig in der Suche enthalten sein müssen.
         Wenn Sie Dokumente finden möchten, in denen mindestens einer der Suchbegriffe enthalten ist, verwenden Sie die <i>OR</i>-Verknüpfung. Bei den Verknüpfungsoperatoren ist die
         Grossschreibweise wichtig, da sie sonst als normale Suchbegriffe gesucht werden. Sie können auch <i>AND</i> und <i>OR</i>-Operatoren verbinden. So findet
         <i>(Mord OR Totschlag) AND Alkohol</i> alle Dokumente, die <i>Mord</i> oder <i>Totschlag</i> sowie auch <i>Alkohol</i> enthalten. Dabei müssen jedoch <b>ZWINGEND</b> Klammern
         gesetzt werden. Ohne Klammern würde der Suchbegriff <i>Mord</i> ignoriert werden.
      </p>
      <p>Sie können auch nach allen Dokumenten suchen, die einen Begriff nicht enthalten. So findet <i>NOT Mord</i> alle Dokumente, in denen der Begriff <i>Mord</i> nicht vorkommt.
      </p>
      <h3>Phrasensuche</h3>
      <p>Sie können mit Anführungszeichen eine feste Wortfolge suchen. Mit <i>"droit des obligations"</i> finden Sie die Wörter genau in dieser Reihenfolge. Dies ist auch empfehlenswert
         für die Suche mit Geschäftsnummern: <i>"4C.296/2003"</i>.
      </p>
      <h3>Distanzsuche</h3>
      <p>Suchen Sie Begriffe, die im gleichen Kontext vorkommen, können Sie das mit der Distanzsuche finden: <i>"Enteignung Verkehrswert"~5</i> findet die beiden Begriffe im maximalen Abstand
         von 5 Wörtern.
      </p>
      <h2>Metadaten</h2>
      <p>Die Suche kann mit Metadaten kombiniert werden. Als Metadaten stehen Ihnen das Entscheiddatum (wenn dieses nicht vorhanden ist, wird das Publikationsdatum verwendet), der Kanton,
         das Gericht und teilweise auch die Kammer zur Verfügung.</p>
      <p>Den Datumsbereich können Sie mit dem Datumsschieber einschränken.</p>
      <p>Die Suche kann auf die eidgenössischen Gerichte oder verschieden Kantone eingeschränkt werden, in dem Sie diese Links anklicken. Diese können den Kanton expandieren und sehen dann
         die dort verfügbaren Gerichte und darunter teilweise auch die Kammern.</p>
      <p>Die Metadaten werden stets mit den aktuellen Suchbegriffen verknüpft. Sollten Sie nur mit Metadaten suchen wollen, geben Sie als Suchbegriff <i>*</i> ein.</p>
      <h2>Aktualisierungen</h2>
      <p>Unter <b-link href="status">Datenstand</b-link> finden Sie eine Übersicht unserer Quellen mit dem Datum des jeweils letzten Abgleichs.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Astuces pour la recherche</h1>
      <p>La recherche sur entscheidsuche.ch est une recherche en texte intégral qui peut être complétée par des métadonnées. Vous pouvez saisir n'importe quel terme dans le champ de recherche. La casse (minuscules et majuscules) ne joue pas de rôle.</p>
      <h2>Recherche de texte</h2>
      <h3>Troncature</h3>
      <p>Si vous effectuez une recherche avec le terme <i>propriétaire</i>, par exemple, vous ne recevrez que les documents dans lesquels ce terme apparaît de cette manière. Les documents contenant <i>propriétaires</i> (pluriel) ne seront pas trouvés. Avec <i>propriétaire*</i>, cependant, tous les mots commençant par ce mot seront trouvés comme par exemple <i>propriétaires</i>. Vous pouvez également utiliser la troncature suivant le mot recherché, c'est-à-dire que <i>*propriétaire</i> trouvera également des termes tels que <i>copropriétaire</i>. Une troncature combinée gauche et droite est également possible : <i>*propriétaire*</i>. On y trouve aussi, par exemple, des <i>copropriétaires</i>. Les lettres peuvent également être remplacées par un caractère de remplacement. Ainsi, <i>?udex</i> trouve à la fois <i>judex</i> et <i>iudex</i>.</p>

      <h3>Recherche approximative</h3>
      <p>Les termes peuvent également être recherchés dans des orthographes similaires. À cette fin, il convient d'utiliser un tilde (<i>~</i>). Une <a href="https://fr.wikipedia.org/wiki/Distance_de_Levenshtein">distance de Levenshtein</a> de 2 est utilisée. Ainsi <i>avocat~</i> trouve aussi <i>avvocati</i> et <i>Advokat</i>. Des écarts plus ou moins grands peuvent être trouvées avec <i>avocat~1</i> ou <i>avocat~3</i>. La recherche floue ne peut pas être combinée avec la troncature dans un terme de recherche.</p>

      <h3>Liaison logique</h3>
      <p>Si vous effectuez une recherche avec deux termes de recherche, ils sont automatiquement liés par <i>AND</i>. Cela signifie que les deux termes doivent être inclus dans la recherche en même temps. Si vous voulez trouver des documents qui contiennent au moins un des termes recherchés, utilisez l'opération <i>OR</i>. Il est important d'utiliser des majuscules pour les opérateurs de liaison, sinon ils seront recherchés comme des termes de recherche normaux. Vous pouvez également combiner les opérateurs <i>AND</i> et <i>OR</i>. Par exemple, <i>(meurtre ou homicide) ET alcool</i> permet de trouver tous les documents qui contiennent un <i>meurtre</i> ou un <i>homicide</i> ainsi que de l'<i>alcool</i>. Toutefois, les parenthèses sont <b>OBLIGATOIRES</b> dans ce cas. Sans parenthèses, le terme <i>meurtre</i> serait ignoré.</p>
      <p>Vous pouvez également rechercher tous les documents qui ne contiennent pas un terme. Ainsi, <i>NOT meurtre</i> trouvera tous les documents qui ne contiennent pas le terme <i>meurtre</i>.

      <h3>Recherche de phrases</h3>
      <p>Vous pouvez utiliser des guillemets pour rechercher une expression fixe. Avec le <i>"droit des obligations"</i>, vous trouverez les mots exactement dans cet ordre. Ceci est également recommandé pour les recherches portant sur les numéros de dossier : <i>"4C.296/2003"</i>.</p>

      <h3>Recherche de distance</h3>
      <p>Si vous cherchez des termes qui apparaissent dans le même contexte, vous pouvez les trouver avec la recherche par distance : <i>"Expropriation valeur marchande"~5</i> trouve les deux termes à une distance maximale de 5 mots.</p>

      <h2>Métadonnées</h2>
      <p>La recherche peut être combinée avec des métadonnées. La date de la décision (si elle n'est pas disponible, la date de publication), le canton, le tribunal et, dans certains cas, la chambre sont disponibles en tant que métadonnées.</p>
      <p>Vous pouvez limiter la plage de dates à l'aide du curseur de date.</p>
      <p>La recherche peut être limitée aux tribunaux fédéraux ou aux différents cantons en cliquant sur ces liens. Vous pouvez alors étendre le canton et voir les tribunaux qui y sont disponibles et, dans certains cas, les chambres situées en dessous.</p>
      <p>Les métadonnées sont toujours liées aux termes de recherche actuels. Si vous souhaitez effectuer une recherche uniquement sur les métadonnées, saisissez <i>*</i> comme terme de recherche.</p>

      <h2>Mises à jour</h2>
      <p>Sous la rubrique État des données, vous trouverez un aperçu de nos sources avec la date de la dernière mise à jour dans chaque cas.</p>
    </template>
    <template v-if="locale==='it'">
      <p>La versione in lingua italiana non è ancora disponibile</p>
    </template>
  </div>
</template>

<style lang="scss">
#organization {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Organization'
})
export default class Organization extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
